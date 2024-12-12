// import express from "express";
// import {
//   getTotalUsers,
//   getRoleDistribution,
//   getRecentUsers,
//   getOTPStats,
// } from "../controllers/analysisController.js";

// const router = express.Router();

// router.get("/total-users", getTotalUsers);
// router.get("/role-distribution", getRoleDistribution);
// router.get("/recent-users", getRecentUsers);
// router.get("/otp-stats", getOTPStats);

// export default router;


import express from "express";
import { getRoleDistribution } from "../controllers/analysisController.js";

const router = express.Router();

router.get("/role-distribution", getRoleDistribution); // Ensure this is GET

export default router;
