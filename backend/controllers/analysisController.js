// import User from "../models/userModel.js"; // Import User model

// // Total Registered Users
// export const getTotalUsers = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     res.status(200).json({ success: true, totalUsers });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Role Distribution
// export const getRoleDistribution = async (req, res) => {
//   try {
//     const roles = await User.aggregate([
//       { $group: { _id: "$role", count: { $sum: 1 } } },
//     ]);
//     res.status(200).json({ success: true, roles });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Recent Registrations
// export const getRecentUsers = async (req, res) => {
//   try {
//     const recentUsers = await User.find({})
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select("name email createdAt role");
//     res.status(200).json({ success: true, recentUsers });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // OTP Verification Status
// export const getOTPStats = async (req, res) => {
//   try {
//     const verified = await User.countDocuments({ otp: null });
//     const pending = await User.countDocuments({ otp: { $ne: null } });
//     res.status(200).json({ success: true, stats: { verified, pending } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



import { User } from "../models/userSchema.js";

// Get count of users by roles
export const getRoleDistribution = async (req, res) => {
  try {
    const roles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }, // Group by role and count
    ]);
    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error in getRoleDistribution:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
