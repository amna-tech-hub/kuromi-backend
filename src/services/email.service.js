import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";


// Setup transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 6-digit OTP
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    specialChars: false
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Your OTP for verification `,
    html: `
      <h2>Hello ${name},</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};