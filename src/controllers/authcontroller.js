import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail,generateOTP } from "../services/email.service.js";

export const postCreateUser = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    if (!name || !password || !email) {
      return res.status(404).json({ massage: "missing field" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(404).json({ massage: "User already exist" });
    }
    const genSalt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password, genSalt);
    let code=generateOTP()
    let expiresAt=new Date(Date.now() +  10 * 60 * 1000);
const user = await User.create({ 
  name, 
  email,
  password: hashedPassword, 
  isVerified:false,
  otp: {
    code: code,
    expiresAt: expiresAt
  }
}); 

let sendmail=await sendOTPEmail(email,code,name)

  //  let token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
  //     expiresIn: "2d",
  //   });

  //   const cookieOptions = {
  //     expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "lax",
  //   };
    // cookie want three things    nameOFcookie,whatToPass,OptionsWhenToExpire
    // res.cookie("token", token, cookieOptions);
  return res.status(200).json({
      success: true,
      message: "Registration successful! Please check your email for OTP verification.",
      userId: user._id
    });
  } catch (error) {
    console.log("error in postCreateUser ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
console.log(email,password,"your email and password");

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      res.status(400).json({
        message: "User not found .please register yourself before login",
      });
    }
    const match = await bcrypt.compare(password, existedUser.password);
    if (!match) {
      res.status(400).json({ message: "incorrect Password" });
    }
    let token = jwt.sign({ id: existedUser._id }, process.env.JWT_PASSWORD, {
      expiresIn: "2d",
    });
    const cookieOptions = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    // cookie want three things    nameOFcookie,whatToPass,OptionsWhenToExpire
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
        user: {
        _id: existedUser._id,
        name: existedUser.name,
        email: existedUser.email,
      },
    });
  
  } catch (err) {
    res.status(400).json({ message: `error occur in login   ${err}` });
  }
};

export const postLogOut = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: "user logout successfully",
  });
};

export const getProfile = (req, res) => {
  return res.json({
    message: "success in vreting the route",
    responseFromReq: `res: ${req.user}`,
  });
};

export const verifyOtp=async(req,res,next)=>{
 const { email, otp } = req.body
 console.log("  can in otp verigy");
 
try{
if(! email || !otp){
  console.log("errr   1");
  
  return res.status(400).json({message:" email and otp are required fields"})
}
  const user=await User.findOne({email})
if(!user){
    console.log("errr   2");

  return res.status(401).json({message:"email not found..Please signIn first"})
}
if(user.isVerified===true){
    console.log("errr   3");

  return res.status(403).json({message:" user already verified"})
}
if(!user.otp){
    console.log("errr   4");

  return res.status(401).json({message:" no otp provided"})
}
if(user.otp.expiresAt<Date.now()){
    console.log("errr   5");

return res.status(403).json({message:"user otp expire"})
}
if(user.otp.code !==otp){
    console.log("errr   6");

return res.status(401).json({message:"Otp doesnot match please try again"})
}
user.isVerified=true
user.otp = undefined; 
await user.save()
// After verification:
const token =  jwt.sign(
  { id: user._id }, 
  process.env.JWT_PASSWORD,
  { expiresIn: "2d" }
);

res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
});
return res.status(200).json({
  success: true,
  message: "Email verified successfully!",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified
}})}

catch(err) {
  console.error("Error in verifyOtp:", err);
  return res.status(400).json({ 
    message: "Internal server error. Please try again." 
  });
}}


