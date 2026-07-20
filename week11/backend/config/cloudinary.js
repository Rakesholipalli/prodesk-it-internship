import { v2 as cloudinary } from 'cloudinary';
import https from 'https';

// Disable SSL verification for development (Windows fix)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configure Cloudinary with hardcoded values (temporary fix)
cloudinary.config({
  cloud_name: 'urpdzlxr',
  api_key: '776271278661361',
  api_secret: 'k5LPgaOYIAl1-vY1s84OEe0qh3A',
  secure: true
});

console.log('✅ Cloudinary configured successfully');

export default cloudinary;
