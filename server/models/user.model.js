// const mongoose = require("mongoose");
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const defaultImage = null;

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: [3, "Full name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Email must be at least 5 characters long"],
    },
    // phoneNo: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    password: {
      type: String,
      required: true,
      select: false,
    },
    // image: {
    //   type: String,
    //   default: defaultImage,
    // },
    // otp: {
    //   verified: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   code: {
    //     type: Number,
    //   },
    // },
    // twoFactor: {
    //   type: Boolean,
    //   default: false,
    // },
    // emergencyContacts: {
    //   type: [String],
    // },
    // socketId: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

export const userModel = mongoose.model("user", userSchema);

