const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const { scheduleOverdueCheck } = require('./jobs/invoiceJobs');

// --- Initializations ---
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB().then(() => {
  // Schedule cron jobs after DB connection is successful
  scheduleOverdueCheck();
});

// --- Middleware ---
// Enable CORS
app.use(cors());

// Body parser for JSON
app.use(express.json());

// Logger for requests (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Application-specific routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));


// --- Error Handling ---
// 404 Not Found handler
app.use(notFound);

// General error handler
app.use(errorHandler);


// --- Server Activation ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
