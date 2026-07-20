import express from 'express';
import Post from '../models/Post.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sprint11-posts',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post',
      error: error.message
    });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and author are required'
      });
    }

    let imageUrl = null;
    let cloudinaryId = null;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }
    }

    const post = await Post.create({
      title,
      content,
      author,
      imageUrl,
      cloudinaryId
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message
    });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (author) post.author = author;

    if (req.file) {
      if (post.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(post.cloudinaryId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      try {
        const result = await uploadToCloudinary(req.file.buffer);
        post.imageUrl = result.secure_url;
        post.cloudinaryId = result.public_id;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new image',
          error: uploadError.message
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating post',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: error.message
    });
  }
});

export default router;
