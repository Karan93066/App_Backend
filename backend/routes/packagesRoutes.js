const express = require("express");
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packagesController");
const upload = require("../middlewares/multerConfig");

const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);
router.post("/", upload.single("background_image"), createPackage);
router.put("/:id", upload.single("background_image"), updatePackage);
router.delete("/:id", deletePackage);

module.exports = router;
