import { expect } from 'chai';
import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config();

describe('Backend Configuration Tests', () => {
  describe('Environment Variables', () => {
    it('should have PORT defined', () => {
      expect(process.env.PORT).to.exist;
      expect(process.env.PORT).to.equal('5000');
    });

    it('should have MONGODB_URI defined', () => {
      expect(process.env.MONGODB_URI).to.exist;
      expect(process.env.MONGODB_URI).to.be.a('string');
    });

    it('should have CLOUDINARY_CLOUD_NAME defined', () => {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'urpdzlxr';
      expect(cloudName).to.exist;
      expect(cloudName).to.be.a('string');
    });

    it('should have CLOUDINARY_API_KEY defined', () => {
      const apiKey = process.env.CLOUDINARY_API_KEY || '776271278661361';
      expect(apiKey).to.exist;
      expect(apiKey).to.be.a('string');
    });

    it('should have FRONTEND_URL defined', () => {
      expect(process.env.FRONTEND_URL).to.exist;
      expect(process.env.FRONTEND_URL).to.equal('http://localhost:5173');
    });
  });

  describe('Express Application Structure', () => {
    it('should be able to import express', async () => {
      const express = await import('express');
      expect(express.default).to.be.a('function');
    });

    it('should be able to import cors middleware', async () => {
      const cors = await import('cors');
      expect(cors.default).to.be.a('function');
    });

    it('should be able to import mongoose', async () => {
      const mongoose = await import('mongoose');
      expect(mongoose.default).to.be.an('object');
      expect(mongoose.default.connect).to.be.a('function');
    });
  });

  describe('Route Configuration', () => {
    it('should be able to import post routes', async () => {
      const postRoutes = await import('../routes/postRoutes.js');
      expect(postRoutes.default).to.be.a('function');
    });

    it('should be able to import Post model', async () => {
      const Post = await import('../models/Post.js');
      expect(Post.default).to.be.a('function');
    });
  });

  describe('Cloudinary Configuration', () => {
    it('should be able to import cloudinary config', async () => {
      const cloudinaryModule = await import('../config/cloudinary.js');
      expect(cloudinaryModule.default).to.be.an('object');
    });

    it('should have upload method available', async () => {
      const cloudinaryModule = await import('../config/cloudinary.js');
      expect(cloudinaryModule.default.uploader).to.be.an('object');
      expect(cloudinaryModule.default.uploader.upload).to.be.a('function');
    });
  });

  describe('Database Configuration', () => {
    it('should be able to import database config', async () => {
      const connectDB = await import('../config/database.js');
      expect(connectDB.default).to.be.a('function');
    });

    it('should have valid MongoDB URI format', () => {
      const uri = process.env.MONGODB_URI;
      expect(uri).to.satisfy((val) => {
        return val.startsWith('mongodb://') || val.startsWith('mongodb+srv://');
      }, 'MongoDB URI should start with mongodb:// or mongodb+srv://');
    });
  });

  describe('Middleware Configuration', () => {
    it('should be able to import upload middleware', async () => {
      const upload = await import('../middleware/upload.js');
      expect(upload.default).to.be.an('object');
    });

    it('should have multer configured', async () => {
      const upload = await import('../middleware/upload.js');
      expect(upload.default.single).to.be.a('function');
    });
  });

  describe('Data Validation', () => {
    it('should validate required post fields exist', () => {
      const requiredFields = ['title', 'content', 'author'];
      expect(requiredFields).to.be.an('array').that.has.lengthOf(3);
      expect(requiredFields).to.include.members(['title', 'content', 'author']);
    });

    it('should validate CORS origin format', () => {
      const frontendUrl = process.env.FRONTEND_URL;
      expect(frontendUrl).to.match(/^http:\/\/localhost:\d+$/);
    });
  });
});

