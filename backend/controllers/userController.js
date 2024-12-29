const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const db = require("../config/db");
const { createUser, findUserByEmail, verifyUser } = require('../models/userModel');

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    text: `Your OTP is: ${otp}`,
  });
};

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await createUser({ username, email, password: hashedPassword, otp, otpExpiresAt });
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: 'User created. Verify your email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    await verifyUser(email);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the user from the database
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await db.query(sql, [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: "user" },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { signUp, verifyEmail, login };
