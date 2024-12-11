import app from "./app.js";
import cloudinary from "cloudinary";

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
