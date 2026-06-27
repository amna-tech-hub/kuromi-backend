import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const authmiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "unauthorized user,you are not authorized to get the profile",
      });
    }
    const decode = await jwt.verify(token, process.env.JWT_PASSWORD);
    let user = await User.findOne({_id:decode.id});
    req.user = user
    next();
  } catch (err) {
    return res.status(401).json({
      message: `unauthorized user ${err}`,
    });
  }
};
