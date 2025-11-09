const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const auctionRoutes = require('./routes/auctionRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', auctionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Auction App API',
    version: '1.0.0',
    endpoints: {
      'GET /api/viewAll': 'Get all auctions',
      'POST /api/addNew': 'Create a new auction',
      'POST /api/placeBid': 'Place a bid on an auction',
      'POST /api/deleteItem': 'Delete an auction item'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`
  });
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Auction Server is running on port ${PORT}`);
  console.log(`📝 API Documentation available at http://localhost:${PORT}/`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});
