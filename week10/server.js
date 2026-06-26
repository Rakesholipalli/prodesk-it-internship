require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Post = require('./models/Post');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res) => {
  const postCount = await Post.countDocuments();
  res.json({
    success: true,
    message: 'Sprint 10 - MongoDB Atlas API',
    database: 'MongoDB Atlas',
    endpoints: {
      'GET /posts': 'Get all posts',
      'POST /posts': 'Create new post',
      'GET /posts/:id': 'Get single post',
      'PUT /posts/:id': 'Update post',
      'DELETE /posts/:id': 'Delete post',
      'GET /posts/aggregation/recent': 'Top 3 most recent posts',
      'POST /users': 'Create new user',
      'GET /users': 'Get all users'
    },
    totalPosts: postCount
  });
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('authorId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch posts', error: error.message });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'name email');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    let { title, content, authorId } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    
    // create default user if no authorId
    if (!authorId) {
      let defaultUser = await User.findOne({ email: 'anonymous@blog.com' });
      if (!defaultUser) {
        defaultUser = await User.create({ name: 'Anonymous', email: 'anonymous@blog.com' });
      }
      authorId = defaultUser._id;
    }
    
    const newPost = await Post.create({ title, content, authorId });
    await newPost.populate('authorId', 'name email');
    
    res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title && !content) {
      return res.status(400).json({ success: false, message: 'At least one field (title or content) must be provided' });
    }
    
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    updates.updatedAt = new Date();
    
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('authorId', 'name email');
    
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post updated successfully', data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update post', error: error.message });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post', error: error.message });
  }
});

// top 3 recent posts
app.get('/posts/aggregation/recent', async (req, res) => {
  try {
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(3).populate('authorId', 'name email');
    res.json({ success: true, message: 'Top 3 Most Recent Posts', count: recentPosts.length, data: recentPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recent posts', error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const user = await User.create({ name, email });
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB Atlas connected`);
});
