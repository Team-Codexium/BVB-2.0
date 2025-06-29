import { Rapper } from "../models/rapper.model.js";
import { EmailVerification } from "../models/emailVerification.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken =  async(id) => {
    try {
      const user = await Rapper.findById(id);
      return await user.generateAccessToken();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Register a new rapper
export const registerRapper = async (req, res) => {
  try {
    const { username, email, fullName, password } = req.body;
    //console.log(req.body)

    // Check if rapper already exists
    const existingRapper = await Rapper.findOne({
      $or: [{ email }, { username }]
    });

    if (existingRapper) {
      return res.status(409).json({
        success: false,
        message: "Rapper already exists with this email or username"
      });
    }

    // Check if email is verified
    const emailVerification = await EmailVerification.findOne({ email });
    if (!emailVerification || !emailVerification.verified) {
      return res.status(400).json({
        success: false,
        message: "Email must be verified before registration. Please verify your email first."
      });
    }

   // console.log("3")
    // Create new rapper
    const rapper = await Rapper.create({
      username,
      email,
      fullName,
      password
    });

    // console.log(rapper);
    // Generate JWT token
    const accessToken = await generateToken(rapper._id);
    // console.log(accessToken)

    // Remove password from response
    const rapperWithoutPassword = await Rapper.findById(rapper._id).select("-password");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(201).json({
      success: true,
      message: "Rapper registered successfully",
      rapper: rapperWithoutPassword,
      accessToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in rapper registration",
      error: error.message
    });
  }
};

// Login rapper
export const loginRapper = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if rapper exists
    const rapper = await Rapper.findOne({ email });
    if (!rapper) {
      return res.status(404).json({
        success: false,
        message: "Rapper not found"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, rapper.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const accessToken  = await generateToken(rapper._id)
    // console.log(accessToken)

    // Remove password from response
    const rapperWithoutPassword = await Rapper.findById(rapper._id).select("-password");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      rapper: rapperWithoutPassword,
      token: accessToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in rapper login",
      error: error.message
    });
  }
};

// Logout rapper
export const logoutRapper = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in rapper logout",
      error: error.message
    });
  }
};

export const currentRapper = (req, res) => {
    return res.status(200).json({success: true, rapper: req.rapper, message: "Rapper fetched successfully"});
}
