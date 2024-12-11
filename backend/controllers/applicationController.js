import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });


export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Ensure Job Seekers are the ones submitting applications
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }

  // Extract application fields from request
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  // Validate required fields
  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  // Check if the job exists
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  // Create application entry in the database without resume
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: null, // No resume for now
  });

  // Respond with success message and application details
  res.status(200).json({
    success: true,
    message: "Application Submitted Successfully!",
    application,
  });
});

// Get all applications posted by an employer
export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { _id } = req.user;
  const applications = await Application.find({ "employerID.user": _id });
  res.status(200).json({
    success: true,
    applications,
  });
});

// Get all applications submitted by a job seeker
export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  const { _id } = req.user;
  const applications = await Application.find({ "applicantID.user": _id });
  res.status(200).json({
    success: true,
    applications,
  });
});

// Delete a job seeker's application
export const jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted Successfully!",
  });
});
