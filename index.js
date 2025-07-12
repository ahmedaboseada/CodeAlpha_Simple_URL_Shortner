// Express Server Template with Organized Structure

// Core Dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

// Initialize environment variables - Load this first
dotenv.config();
app.set('trust proxy', true);

// Import routes and DB connection
const connectDB = require('./DB/DBConnection');
const urlRouter = require('./routes/urlRoutes');
const indexRouter = require('./routes/indexRoutes');

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database before setting up routes
connectDB();

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Store the base URL for dynamic access
app.use((req, res, next) => {
    // Determine the base URL dynamically from the request
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    req.baseUrl = `${protocol}://${host}`;
    next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRouter);
app.use('/short', urlRouter);

// Health Check Route
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        baseUrl: req.baseUrl
    });
});

// Error Handling Middleware
// 404 handler
app.use((req, res) => {
    res.status(404).json({error: 'Not Found'});
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
        }
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Public URL: ${process.env.PUBLIC_URL}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

// Export app for testing
module.exports = app;
