import dotenv from "dotenv";
dotenv.config();

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://kuromi-task.vercel.app',
    'https://kuromi-task-v6fu.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    /^https:\/\/kuromi-task-.*\.vercel\.app$/,
    /^https:\/\/kuromi-backend-.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware - THIS IS ALL YOU NEED
app.use(cors(corsOptions));

// ❌ DELETE THIS LINE - it's causing the error
// app.options('*', cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Hello Amna, I am server");
});

// Import routes
import { authrouter } from './src/routes/authRoute.js';
import { todoRouter } from "./src/routes/todoRouter.js";

app.use('/auth', authrouter);
app.use('/todo', todoRouter);

// Database connection
async function connectdb() {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log("✅ MongoDB Connected Successfully!");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
}

connectdb();

export default app;