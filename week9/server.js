const express = require('express');
const app = express();
const PORT = 5000;


let blogPosts = [];
let postIdCounter = 1;


const getCurrentTimestamp = () => {
  return new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
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

app.use(express.json());

const requestLogger = (req, res, next) => {
  const timestamp = getCurrentTimestamp();
  console.log(`[${req.method}] ${req.url} - ${timestamp}`);
  next();
};

app.use(requestLogger);

const getServerStatus = (req, res) => {
  res.json({
    success: true,
    message: 'The Data Hub API Server is running',
    version: '1.0.0',
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
      }
    }
  });
};

app.get('/', getServerStatus);

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
  const { title, content, author } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }
  
  const newPost = createPost(title, content, author);
  
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: newPost
  });
};

app.post('/posts', createNewPost);

const updateExistingPost = (req, res) => {
  const updatedPost = updatePost(req.params.id, req.body);
  
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
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
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
};

app.post('/login', handleLogin);

const startServer = () => {
  console.log('=================================');
  console.log(' The Data Hub API Server');
  console.log('=================================');
  console.log(`Server Status: ACTIVE`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: Development`);
  console.log(`Timestamp: ${new Date().toLocaleString()}`);
  console.log('=================================');
  console.log('Available Endpoints:');
  console.log('  GET    /posts');
  console.log('  GET    /posts/:id');
  console.log('  POST   /posts');
  console.log('  PUT    /posts/:id');
  console.log('  DELETE /posts/:id');
  console.log('  POST   /login');
  console.log('=================================');
};

app.listen(PORT, startServer);
