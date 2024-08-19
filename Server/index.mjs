import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import {userRouter }from './routes/user.route.mjs';
import authRouter from './routes/auth.route.mjs';
import chatRoute from './routes/chat.route.mjs';
import messageRoute from './routes/message.route.mjs';
import listingRouter from './routes/listing.route.mjs';
import connectDB from './config/db.mjs';
import emailRoutes from './routes/emailRoute.mjs';
import { getNotificationNumber, getUserRoleMonthlyCounts, getAdminEmailController } from './controllers/user.controller.mjs';
import { verifyToken } from './utils/verifyUser.mjs';
import maintenanceRoute from './routes/maintenance.route.mjs';
import { updateMaintenance } from './controllers/maintenanceController.mjs';
import paypalRoutes from './routes/paypalRoutes.mjs';
import corsOptions from './config/corsOptions.mjs';
import { Server } from 'socket.io';
import { createServer } from 'http';
import * as paypal from './paypal-api.mjs';

// Load environment variables from .env file
// dotenv.config();
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
app.use(cookieParser());
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

app.post("/api/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { product } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});



// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Client/dist')));

// The "catchall" handler: for any request that doesn't match one above, send back the React index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'));
});

// Serve the index.html file on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/dist', 'index.html'));
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

// Create HTTP server and integrate Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://cdn.socket.io/4.0.0/socket.io.min.js", "https://mernestate-tlmc.onrender.com", "http://localhost:3000"],
  },
});

// Socket.io logic
let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.some(user => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
    console.log(`User added: ${userId}`);
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', data);
      console.log(`Message sent to ${receiverId}:`, data);
    } else {
      socket.emit('error', 'Receiver not found');
      console.log(`Message failed, receiver not found: ${receiverId}`);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}!`);
});
