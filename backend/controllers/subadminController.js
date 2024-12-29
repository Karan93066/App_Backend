const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require("jsonwebtoken");

exports.createSubAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO sub_admins (name, password) VALUES (?, ?)";
    await db.query(sql, [name, hashedPassword]);
    res.send("Sub-admin created successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAllSubAdmins = async (req, res) => {
  try {
    const sql = "SELECT id, name, created_at FROM sub_admins";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateSubAdmin = async (req, res) => {
  try {
    const { name, password, id } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const sql = hashedPassword
      ? "UPDATE sub_admins SET name = ?, password = ? WHERE id = ?"
      : "UPDATE sub_admins SET name = ? WHERE id = ?";
    const params = hashedPassword ? [name, hashedPassword, id] : [name, id];
    await db.query(sql, params);
    res.send("Sub-admin updated successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    const sql = "DELETE FROM sub_admins WHERE id = ?";
    await db.query(sql, [req.params.id]);
    res.send("Sub-admin deleted successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.loginSubAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Query the sub-admin from the database
    const sql = "SELECT * FROM sub_admins WHERE name = ?";
    const [results] = await db.query(sql, [name]);
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const subAdmin = results[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, subAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: subAdmin.id, role: "subadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token and sub-admin details
    res.status(200).json({
      message: "Login successful",
      token,
      subAdmin: { id: subAdmin.id, name: subAdmin.name, role: "subadmin" },
    });
  } catch (error) {
    console.error("Sub-Admin Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

