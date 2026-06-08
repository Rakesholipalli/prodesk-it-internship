const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;


const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const MAX_AUTHOR_LENGTH = 100;


let blogPosts = [];
let postIdCounter = 1;


const getCurrentTimestamp = () => {
  return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};


const sanitizeInput = (input, maxLength) => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
};


const validatePostData = (title, content, author) => {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required and cannot be empty');
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.push(`Title must not exceed ${MAX_TITLE_LENGTH} characters`);
  }
  
  if (!content || content.trim().length === 0) {
    errors.push('Content is required and cannot be empty');
  } else if (content.length > MAX_CONTENT_LENGTH) {
    errors.push(`Content must not exceed ${MAX_CONTENT_LENGTH} characters`);
  }
  
  if (author && author.length > MAX_AUTHOR_LENGTH) {
    errors.push(`Author name must not exceed ${MAX_AUTHOR_LENGTH} characters`);
  }
  
  return errors;
};

const findPostById = (id) => {
  return blogPosts.find(post => post.id === parseInt(id));
};

const createPost = (title, content, author = 'Anonymous') => {
  const newPost = {
    id: postIdCounter++,
    title,
    content,
    author,
    createdAt: new Date().toISOString()
  };
  blogPosts.push(newPost);
  return newPost;
};

const updatePost = (id, updates) => {
  const postIndex = blogPosts.findIndex(post => post.id === parseInt(id));
  if (postIndex === -1) return null;
  
  const { title, content, author } = updates;
  if (title) blogPosts[postIndex].title = title;
  if (content) blogPosts[postIndex].content = content;
  if (author) blogPosts[postIndex].author = author;
  blogPosts[postIndex].updatedAt = new Date().toISOString();
  
  return blogPosts[postIndex];
};

const deletePost = (id) => {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(post => post.id !== parseInt(id));
  return blogPosts.length < initialLength;
};

const generateMockToken = (username) => {
  const payload = {
    username,
    userId: Math.floor(Math.random() * 10000),
    iat: Date.now()
  };
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(payload)).toString('base64')}.mockSignature${Date.now()}`;
};


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});


const requestLogger = (req, res, next) => {
  const timestamp = getCurrentTimestamp();
  console.log(`[${req.method}] ${req.url} - ${timestamp}`);
  next();
};

app.use(requestLogger);


const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.message);
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body',
      error: 'Bad Request'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.stack
  });
};

const getServerStatus = (req, res) => {
  res.json({
    success: true,
    message: 'The Data Hub API Server is running',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: {
      posts: {
        'GET /posts': 'Get all posts',
        'GET /posts/:id': 'Get single post',
        'POST /posts': 'Create new post',
        'PUT /posts/:id': 'Update post',
        'DELETE /posts/:id': 'Delete post'
      },
      auth: {
        'POST /login': 'Mock authentication'
      },
      health: {
        'GET /health': 'Health check endpoint'
      }
    }
  });
};

app.get('/', getServerStatus);


const healthCheck = (req, res) => {
  const healthData = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    },
    database: {
      status: 'connected',
      postsCount: blogPosts.length
    }
  };
  
  res.status(200).json(healthData);
};

app.get('/health', healthCheck);

const getAllPosts = (req, res) => {
  res.json({
    success: true,
    count: blogPosts.length,
    data: blogPosts
  });
};

app.get('/posts', getAllPosts);

const getPostById = (req, res) => {
  const post = findPostById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: `Post with ID ${req.params.id} not found`
    });
  }
  
  res.json({
    success: true,
    data: post
  });
};

app.get('/posts/:id', getPostById);

const createNewPost = (req, res) => {
  try {
    let { title, content, author } = req.body;
    
  
    title = sanitizeInput(title, MAX_TITLE_LENGTH);
    content = sanitizeInput(content, MAX_CONTENT_LENGTH);
    author = author ? sanitizeInput(author, MAX_AUTHOR_LENGTH) : 'Anonymous';
    
  
    const validationErrors = validatePostData(title, content, author);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const newPost = createPost(title, content, author);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post due to server error',
      error: error.message
    });
  }
};

app.post('/posts', createNewPost);

const updateExistingPost = (req, res) => {
  try {
    let { title, content, author } = req.body;
    
    
    if (title) title = sanitizeInput(title, MAX_TITLE_LENGTH);
    if (content) content = sanitizeInput(content, MAX_CONTENT_LENGTH);
    if (author) author = sanitizeInput(author, MAX_AUTHOR_LENGTH);
    
    
    if (!title && !content && !author) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (title, content, or author) must be provided for update'
      });
    }
    
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (author) updates.author = author;
    
    const updatedPost = updatePost(req.params.id, updates);
    
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${req.params.id} not found`
      });
    }
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post due to server error',
      error: error.message
    });
  }
};

app.put('/posts/:id', updateExistingPost);

const removePost = (req, res) => {
  const deleted = deletePost(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Post with ID ${req.params.id} not found`
    });
  }
  
  res.json({
    success: true,
    message: `Post with ID ${req.params.id} deleted successfully`
  });
};

app.delete('/posts/:id', removePost);

const handleLogin = (req, res) => {
  try {
    let { username, password } = req.body;
    
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    
    username = sanitizeInput(username, 50);
    
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    const mockToken = generateMockToken(username);
    
    res.json({
      success: true,
      message: 'Authentication successful',
      token: mockToken,
      user: {
        username,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed due to server error',
      error: error.message
    });
  }
};

app.post('/login', handleLogin);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /posts',
      'GET /posts/:id',
      'POST /posts',
      'PUT /posts/:id',
      'DELETE /posts/:id',
      'POST /login'
    ]
  });
});


app.use(errorHandler);

const startServer = () => {
  console.log('=================================');
  console.log(' The Data Hub API Server');
  console.log('=================================');
  console.log(`Server Status: ACTIVE`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'Development'}`);
  console.log(`Timestamp: ${new Date().toLocaleString()}`);
  console.log('=================================');
  console.log('Available Endpoints:');
  console.log('  GET    /');
  console.log('  GET    /health');
  console.log('  GET    /posts');
  console.log('  GET    /posts/:id');
  console.log('  POST   /posts');
  console.log('  PUT    /posts/:id');
  console.log('  DELETE /posts/:id');
  console.log('  POST   /login');
  console.log('=================================');
  console.log('Features:');
  console.log('  ✓ CORS enabled');
  console.log('  ✓ Input sanitization');
  console.log('  ✓ Error handling');
  console.log('  ✓ Health monitoring');
  console.log('=================================');
};

app.listen(PORT, startServer);
