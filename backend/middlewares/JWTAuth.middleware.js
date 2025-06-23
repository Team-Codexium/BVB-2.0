import { Rapper } from "../models/rapper.model.js";
import jwt from "jsonwebtoken"

export const verifyRapperJWT = async(req, res, next) => {
  try {
    const token = req.cookie?.accessToken || req.header("Authorization").replace("Bearer ", "");
    console.log("token", token)

    if (!token) {
      return res.status(401).json({success: false, message: "Token not found!"})
    }


    //Decoding token
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    //User with id from decoded token
    const rapper = await Rapper.findById(decodedToken?._id).select("-password");

    if (!rapper) {
      return res.status(401).json({success: false, message: "Unauthorize"})
    }

    //Adding user in req
    req.rapper = rapper;
    next();


  } catch (error) {
    return res.status(401).json({success: false, message: error.message});
  }
}