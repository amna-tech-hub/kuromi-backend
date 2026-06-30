import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTPEmail, generateOTP, sendResetPasswordEmail } from "../services/email.service.js";
import { temptoken } from "../models/temptoken.model.js";

export const postCreateUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  try {
    if (!name || !password || !email) {
      return res.status(404).json({ message: "missing field" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(404).json({ message: "User already exist" });
    }
    const genSalt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password, genSalt);
    let code = generateOTP();
    let expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: {
        code: code,
        expiresAt: expiresAt,
      },
    });

    let sendmail = await sendOTPEmail(email, code, name);

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
      message:
        "Registration successful! Please check your email for OTP verification.",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      
      return res.status(400).json({
        message: "User not found .please register yourself before login",
      });
    }
   
    
    const match = await bcrypt.compare(password, existedUser.password);
    if (!match) {

     return res.status(400).json({ message: "incorrect Password" });
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

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {

      return res
        .status(400)
        .json({ message: " email and otp are required fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {

      return res
        .status(401)
        .json({ message: "email not found..Please signIn first" });
    }
    if (user.isVerified === true) {

      return res.status(403).json({ message: " user already verified" });
    }
    if (!user.otp) {

      return res.status(401).json({ message: " no otp provided" });
    }
    if (user.otp.expiresAt < Date.now()) {

      return res.status(403).json({ message: "user otp expire" });
    }
    if (user.otp.code !== otp) {

      return res
        .status(401)
        .json({ message: "Otp doesnot match please try again" });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    // After verification:
    const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });
    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res.status(400).json({
      message: "Internal server error. Please try again.",
    });
  }
};
export const resendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    // 1. Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please register first." 
      });
    }

    // 3. Check if already verified
    if (user.isVerified) {
      return res.status(403).json({ 
        message: "User already verified" 
      });
    }

    // 4. Initialize otp if it doesn't exist
    if (!user.otp) {
      user.otp = {};
    }

    // 5. Cooldown check (30 seconds)
    if (user.otp.resendAt) {
      const timeElapsed = Date.now() - user.otp.resendAt;
      if (timeElapsed < 30000) {
        const remainingSeconds = Math.ceil((30000 - timeElapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before trying again.`
        });
      }
    }

    // 6. Reset count after 2 hours (if eligible)
    if (user.otp.resendAt) {
      const timeSinceLastResend = Date.now() - user.otp.resendAt;
      if (timeSinceLastResend >= 2 * 60 * 60 * 1000) {
        user.otp.resentcount = 0; // Reset count
        // Optionally reset the reset timer
        // user.otp.resentcountResetAt = null;
      }
    }

    // 7. Rate limit check (max 4 resends)
    if (user.otp.resentcount >= 4) {
      return res.status(429).json({
        message: "Too many resend attempts. Please try again after 2 hours."
      });
    }

    // 8. Generate new OTP
    const otp = generateOTP();

    // 9. Update user with new OTP data
    user.otp.code = otp;
    user.otp.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otp.attempts = 0; // Reset verification attempts
    user.otp.resendAt = new Date();
    user.otp.resentcount = (user.otp.resentcount || 0) + 1;

    // 10. Save user
    await user.save();

    // 11. Send email
    await sendOTPEmail(email, otp, user.name);

    // 12. Return success
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Error in resend OTP:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later."
    });
  }
};

export const postresetpassword=async(req,res)=>{

 const {password}=req.body.data.formdata
const {token}=req.body.data
const{email}=req.body.data
const user=await User.findOne({email})
  const genSalt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(password, genSalt);
    
user.password = hashedPassword 
await user.save()
return res.json({message:" your passwrod has been successfully updated"})

}


export const postforgetpassword=async(req,res)=>{
let email=req.body.data
const existedUser=await User.findOne({email})
if(!existedUser){
  return res.status(404).json({message:"user not found"})
}
const token=12345
await temptoken.create({
 token,
     userId:existedUser._id,
   createdAt: Date.now()
   
 
})
const FRONTEND_URL=process.env.FRONTEND_URL
sendResetPasswordEmail(email,`${FRONTEND_URL}/auth/resetpassword/${token}`,existedUser.name)

}

export const verifyresetpassword=async(req,res)=>{
const {token}=req.params
if(!token){
  return res.status(404).json({message:"token not received"})
}

let {userId}= await temptoken.findOne({token})
let user=await User.findOne({_id:userId})

if(!user){
    return res.json({message:"user not found"})

}
if(!user.email){
    return res.json({message:"email was not given"})

}
if(isVerified==false){
      return res.json({message:"user is not verified"})

}

res.status(200).json(
  {

    email:user.email,
    message:"sucess"})
}

