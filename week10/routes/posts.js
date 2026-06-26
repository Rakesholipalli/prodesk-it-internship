const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// CREATE - Add a new post
router.post('/', async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// READ - Get all posts with author population
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'name email bio')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// READ - Get single post by ID with author population
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name email bio');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE - Update post by ID
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('authorId', 'name email bio');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Delete post by ID
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PHASE 3 - AGGREGATION: Get Top 3 Most Recent Posts
router.get('/aggregation/recent-top3', async (req, res) => {
  try {
    const recentPosts = await Post.find()
      .populate('authorId', 'name email bio')
      .sort({ createdAt: -1 })
      .limit(3);
    
    res.status(200).json({
      success: true,
      count: recentPosts.length,
      message: 'Top 3 Most Recent Posts',
      data: recentPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
