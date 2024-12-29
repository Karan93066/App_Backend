const db = require('../config/db');

const findAdminByEmail = async (email) => {
  const query = `SELECT * FROM admins WHERE email = ?`;
  console.log(email)
  const [rows] = await db.query(query, [email]);
  return rows[0];
};


const getAllUsers = async ({ search, isVerified, offset, limit }) => {
    let query = `SELECT * FROM users`;
    const queryParams = [];
  
    // Add filtering conditions
    if (isVerified !== undefined) {
      queryParams.push(isVerified === 'true' ? 1 : 0);
      query += ` WHERE isVerified = ?`;
    }
  
    // Add search conditions
    if (search) {
      const searchQuery = `%${search}%`;
      queryParams.push(searchQuery, searchQuery);
      query += isVerified !== undefined ? ` AND` : ` WHERE`;
      query += ` (username LIKE ? OR email LIKE ?)`;
    }
  
    // Count total users for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filteredUsers`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;
  
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
  
    const [rows] = await db.query(query, queryParams);
    return { data: rows, total };
  };
  

module.exports = { findAdminByEmail, getAllUsers };
