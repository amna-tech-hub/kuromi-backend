dotenv.config();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import {User} from './src/models/user.model.js'
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Full todo list array

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
      credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("heelo amna i am server");
});

// registering the user
// import {userRouter} from '../backend/src/routes/userRoutes.js'

// app.use('/user', userRouter);

// here we will register routes
import {authrouter} from './src/routes/authRoute.js'
import { todoRouter } from "./src/routes/todoRouter.js";
import cookieParser from "cookie-parser";
app.use('/auth',authrouter)
app.use('/todo',todoRouter)







async function connectdb() {
  try {
    await mongoose.connect(`${process.env.DB_URI}/Todo`)
      app.listen(process.env.PORT, () => {
        console.log(
          `server is running on port http://localhost:${process.env.PORT}`,
        );
       
      })
    
  } catch (err) {
    console.log("failed to connect db ", err);
    process.exit(1)
  }
}
connectdb()
app.get("/todos", (req, res) => {
  res.send(todos);
});
export default app;