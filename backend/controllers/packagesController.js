const db = require("../config/db");

exports.getAllPackages = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM packages");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM packages WHERE id = ?", [
      id,
    ]);
    if (results.length === 0)
      return res.status(404).json({ message: "Package not found" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPackage = async (req, res) => {
  console.log("i am running");
  const { mrp, discount_percentage, actual_price, days, isActive } = req.body;
  console.log(mrp, discount_percentage, actual_price, days, isActive);
  const background_image = req.file ? req.file.path : null;
  console.log(background_image);
  try {
    const [results] = await db.query(
      "INSERT INTO packages (background_image, mrp, discount_percentage, actual_price, days, isActive) VALUES (?, ?, ?, ?, ?, ?)",
      [background_image, mrp, discount_percentage, actual_price, days, isActive]
    );
    res
      .status(201)
      .json({ message: "Package created successfully", id: results.insertId });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  const { id } = req.params;
  const { mrp, discount_percentage, actual_price, days, isActive } = req.body;
  const background_image = req.file ? req.file.path : null;

  try {
    let query =
      "UPDATE packages SET mrp = ?, discount_percentage = ?, actual_price = ?, days = ?, isActive = ?";
    const params = [mrp, discount_percentage, actual_price, days, isActive];

    if (background_image) {
      query += ", background_image = ?";
      params.push(background_image);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.query(query, params);
    res.json({ message: "Package updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM packages WHERE id = ?", [id]);
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
