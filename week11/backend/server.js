import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import postRoutes from './routes/postRoutes.js';

const app = express();

connectDB();


const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    
   
    if (origin.includes('localhost')) return callback(null, true);
    
  
    if (origin.includes('prodesk-it-internship-p582') && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
   
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/posts', postRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
});
