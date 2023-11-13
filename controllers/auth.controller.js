import User from "../models/user.model.js";
import CryptoJS from "crypto-js";
import Token from "../models/token.model.js";
import { validateData } from "../utils/validateData.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { sendEmailForPasswordReset } from "../utils/sendEmailForPasswordReset.js";
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import joi from "joi";
import passwordComplexity from "joi-password-complexity";

const webBaseUrl = "https://wasty.onrender.com";
const mobileBaseUrl = "https://wasty.onrender.com";

export const register = async (req, res, next) => {
  try {
    // Validate user data
    const { error } = validateData(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "user already exists!" });
    }

    // Encrypt the user's password and save it
    const hashedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const appType = req.body.appType;
    let baseUrl;

    if (appType === "app1") {
      baseUrl = webBaseUrl;
    } else if (appType === "app2") {
      baseUrl = mobileBaseUrl;
    } else {
      return res.status(400).send({ message: "Invalid appType" });
    }

    // Generate a verification token and send a verification email
    const token = new Token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    const savedToken = await token.save();

    const url = `${webBaseUrl}/api/auth/${savedToken.userId}/verify/${savedToken.token}`;
    await sendVerificationEmail(savedUser.email, "Verify your email!", url);

    res
      .status(200)
      .send({ message: "Email sent to your account please verify!" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.log(error);
  }
};

export const verifyTokenSentToEmail = async (req, res, next) => {
  try {
    // Find the user and verify the token
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError(400, "No user found"));

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id }, { verified: true });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(401, "User not found!"));
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return next(createError(401, "Wrong credentials!"));
    }

    const appType = req.body.appType;
    let baseUrl;

    if (appType === "app1") {
      baseUrl = webBaseUrl;
    } else if (appType === "app2") {
      baseUrl = mobileBaseUrl;
    } else {
      return res.status(400).send({ message: "Invalid appType" });
    }
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${baseUrl}/api/auth/${token.userId}/verify/${token.token}`;
        await sendVerificationEmail(user.email, "Verify email", url);
      }

      return res
        .status(400)
        .send({ message: "Email sent to your account, please verify" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, confirmPassword, ...info } = user._doc;
    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    res.status(500).send({ message: "Intenal server error" });
    console.log(error);
  }
};

export const passwordResetLink = async (req, res, next) => {
  try {
    // Validate the email and send a password reset link
    const emailSchema = joi.object({
      email: joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(409, "User with given email not found"));

    let token = await Token.findOne({
      userId: user._id,
    });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const url = `${webBaseUrl}/password-reset/${user._id}/${token.token}`;
    await sendEmailForPasswordReset(user.email, "Password-Reset", url);
    res
      .status(200)
      .send({ message: "Password reset link sent to your email account" });
  } catch (error) {
    console.log(error);
  }
};

export const verifyPasswordResetLink = async (req, res, next) => {
  try {
    // Verify the user and the reset token
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError(409, "Invalid user"));

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return next(createError(409, "Invalid Link"));

    res.status(200).send({ message: "Valid URL" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // Validate the new password and reset it
    const passwordSchema = joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError(409, "Invalid user"));
    res.status(409).send({ message: "Invalid User" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) res.status(409).send({ message: "Invalid Link" });
    if (!user.verified) user.verified = true;

    // Encrypt the new password and save it
    const hashedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
