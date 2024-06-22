import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/user.route.mjs';
import authRouter from './routes/auth.route.mjs';
import chatRoute from './routes/chat.route.mjs';
import messageRoute from './routes/message.route.mjs';
import listingRouter from './routes/listing.route.mjs';
import connectDB from './config/db.mjs';
import emailRoutes from './routes/emailRoute.mjs'
import { getNotificationNumber } from './controllers/user.controller.mjs';
import { verifyToken } from './utils/verifyUser.mjs';
import { getUserRoleMonthlyCounts } from './controllers/user.controller.mjs';
import maintenanceRoute from './routes/maintenance.route.mjs';
import { getAdminEmailController } from './controllers/user.controller.mjs';  
import { updateMaintenance } from './controllers/maintenanceController.mjs';
import paypalRoutes from './routes/paypalRoutes.mjs';
// Load environment variables from.env file
dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// Middleware for logging requests and tokens (for debugging)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log(`Token: ${req.headers.authorization}`);
  }
  next();
});

// Middlewares
app.use(cors()); // Allow all origins or configure specific origins
app.use(express.json()); // Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies (form data)
app.use(cookieParser());

// Routes

app.use('/api/maintenance/update/:id', verifyToken, updateMaintenance);
app.use('/api/maintenance', maintenanceRoute);
app.get('/api/user/count', getUserRoleMonthlyCounts);
app.get('/api/user/admin', verifyToken, getAdminEmailController);
app.get('/api/user/notification', verifyToken, getNotificationNumber);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);
app.use('/api/email', emailRoutes);
app.use('/api/paypal', paypalRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'Client', 'dist')));

// The "catchall" handler: for any request that doesn't match one above, send back the React index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
