const db = require("../config/db");

exports.getAllOffers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM offers");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOfferById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM offers WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Offer not found" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOffer = async (req, res) => {
  const { min_amount, offer_percentage, coupon_code } = req.body;
  const background_image = req.file ? req.file.path : null;

  try {
    const [results] = await db.query(
      "INSERT INTO offers (background_image, min_amount, offer_percentage, coupon_code) VALUES (?, ?, ?, ?)",
      [background_image, min_amount, offer_percentage, coupon_code]
    );
    res.status(201).json({ message: "Offer created successfully", id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOffer = async (req, res) => {
  const { id } = req.params;
  const { min_amount, offer_percentage, coupon_code, isActive } = req.body;
  const background_image = req.file ? req.file.path : null;

  try {
    let query =
      "UPDATE offers SET min_amount = ?, offer_percentage = ?, coupon_code = ?, isActive = ?";
    const params = [min_amount, offer_percentage, coupon_code, isActive];

    if (background_image) {
      query += ", background_image = ?";
      params.push(background_image);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.query(query, params);
    res.json({ message: "Offer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM offers WHERE id = ?", [id]);
    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
