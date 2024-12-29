const { getAllUsers } = require('../models/adminModel');
const jwt = require("jsonwebtoken");
const db = require("../config/db");


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the admin from the database
    const sql = "SELECT * FROM admins WHERE email = ?";
    const [results] = await db.query(sql, [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = results[0];

    // Compare plaintext passwords directly
    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: "admin", isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token and admin details
    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {role: "admin" },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



const getUsers = async (req, res) => {
  try {
    const { search, isVerified, page = 1, limit = 10 } = req.query;

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Call the model to get users with filters, search, and pagination
    const users = await getAllUsers({ search, isVerified, offset, limit });

    res.status(200).json({ 
      users: users.data, 
      totalUsers: users.total, 
      currentPage: parseInt(page), 
      totalPages: Math.ceil(users.total / limit) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = { adminLogin, getUsers };
