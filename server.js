// 1. Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

// 2. Import all dependencies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { User } from './src/models/user.model.js';

// 3. Initialize express app
const app = express();

// 4. CORS Configuration - IMPORTANT FIX
const corsOptions = {
  origin: [
    'https://kuromi-task.vercel.app',
    'https://kuromi-task-v6fu.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// 5. Apply middleware in correct order
app.use(cors(corsOptions)); // CORS FIRST
app.use(express.json()); // JSON parser
app.use(express.urlencoded({ extended: true })); // URL encoded data
app.use(cookieParser()); // Cookie parser

// 6. Handle preflight requests
app.options('*', cors(corsOptions));

// 7. Test route
app.get("/", (req, res) => {
  res.send("Hello Amna, I am server");
});

// 8. Import routes AFTER middleware
import { authrouter } from './src/routes/authRoute.js';
import { todoRouter } from "./src/routes/todoRouter.js";

// 9. Use routes
app.use('/auth', authrouter);
app.use('/todo', todoRouter);

// 10. Database connection
async function connectdb() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
    
    // Only start server if not in production (Vercel handles this)
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.log("❌ Failed to connect to DB:", err);
    process.exit(1);
  }
}

connectdb();

// 11. Export for Vercel
export default app;