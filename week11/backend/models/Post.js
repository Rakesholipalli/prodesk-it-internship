import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    cloudinaryId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
