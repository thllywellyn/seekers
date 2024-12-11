import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import dotenv from "dotenv";
import { generateOTP } from "../utils/otp.js";
import { sendOTP } from "../utils/sendEmail.js";

dotenv.config({ path: "./config/config.env" });

// Register User with OTP Generation
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill the full form!"));
  }

  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    otp,
    otpExpiry,
  });

  await sendOTP(email, otp);

  res.status(201).json({
    success: true,
    message: "User registered successfully! OTP sent to your email.",
  });
});

// Verify OTP and Login
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please provide email and OTP!"));
  }

  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return next(new ErrorHandler("Invalid or expired OTP!", 400));
  }

  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true; // Mark the user as verified
  await user.save();

  sendToken(user, 200, res, "OTP verified and user logged in successfully!");
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role !"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password !", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found !`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In Sucessfully !");
});
// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});

// Get User Details
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
