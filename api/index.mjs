import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.mjs';
import authRouter from './routes/auth.route.mjs';
import chatRoute from './routes/chat.route.mjs'
import messageRoute from './routes/message.route.mjs'
import listingRouter from './routes/listing.route.mjs';
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.mjs";
import path from 'path';
import cors from 'cors';
import bodyParser from "body-parser";
//import corsOptions from "./config/corsOptions.mjs";
dotenv.config();


connectDB();

  const __dirname = path.resolve();

const app = express();
// Allow requests from all origins

// Middlewares
app.use(express.json()); // parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // parses urlencoded bodies (form data)
app.use(cors());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
