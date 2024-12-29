const db = require("../config/db");

const createUser = async (user) => {
  const query = `
    INSERT INTO users (username, email, password, otp, otpExpiresAt)
    VALUES (?, ?, ?, ?, ?)
  `;
  console.log(query);
  const [result] = await db.query(query, [
    user.username,
    user.email,
    user.password,
    user.otp,
    user.otpExpiresAt,
  ]);
  return result;
};

const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

const verifyUser = async (email) => {
  const query = `UPDATE users SET isVerified = true, otp = NULL, otpExpiresAt = NULL WHERE email = ?`;
  await db.query(query, [email]);
};

module.exports = { createUser, findUserByEmail, verifyUser };
