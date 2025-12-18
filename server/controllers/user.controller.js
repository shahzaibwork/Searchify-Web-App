import { userModel } from "../models/user.model.js";
import { validationResult } from "express-validator"
import { generateToken } from "../utils/authUtils.js";


export const registerUser = async (req, res, next) => {

    console.log("THe funcs in server running")
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { fullname, email, password } = req.body;
  
      const isUserAlready = await userModel.findOne({ email });
  
      if (isUserAlready) {
        return res.status(400).json({ message: "User already exist" });
      }
  
      const hashedPassword = await userModel.hashPassword(password);

  
      const user = await userModel.create({
        fullname,
        email,
        password: hashedPassword,
      });
  

      const token = generateToken(user._id)
    //   const otp = randomString();
    //   const to = email;
    //   await otpController.sendOtp(to, otp);
  
    //   //save otp to db
    //   user.otp.code = otp;
      await user.save();
  
    //   user.otp.code = null;
      res.status(201).json({ token, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const loginUser = async (req, res, next) => {
    console.log("fung login runnig")
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      const user = await userModel.findOne({ email }).select("+password");
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = generateToken(user._id)
  
      // if (!user.otp.verified) {
      //   return res.status(401).json({
      //     message: "Please verify your account first or request for new otp",
      //   });
      // }
  
    //   const otp = randomString();
    //   const to = user.email;
    //   await otpController.sendOtp(to, otp);
  
    //   user.otp.code = otp;
    //   user.otp.verified = false;
      await user.save();
  
      res
        .status(200)
        .json({ user, token });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };


  export const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    // Add the token to the blacklist
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // Convert expiration time to Date
  
    await RevokedToken.create({ token, expiresAt });
  
    res.status(200).json({ message: "Logged out successfully" });
  };