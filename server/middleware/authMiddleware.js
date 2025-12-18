import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import dotenv from 'dotenv'
import { revokedToken } from "../models/revokedToken.model.js";

dotenv.config({
    path: `${process.cwd()}/.env`
})


export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const revokedToken = await revokedToken.findOne({ token });

    if(revokedToken){
      return res.status(401).json({ message: "Token is revoked" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await userModel.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


