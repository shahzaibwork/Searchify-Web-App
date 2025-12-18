import express from 'express'
import { body } from 'express-validator'
import { loginUser, logout, registerUser } from '../controllers/user.controller.js';
import { verifyUser } from '../middleware/authMiddleware.js';
const router = express.Router()


router.post(
    "/register",
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    registerUser
  );
  
  router.post(
    "/login",
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    loginUser
  );

  router.get("/logout", verifyUser, logout)

  export default router