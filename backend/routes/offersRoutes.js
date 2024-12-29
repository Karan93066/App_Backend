const express = require("express");
const {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offersController");
const upload = require("../middlewares/multerConfig");

const router = express.Router();

router.get("/", getAllOffers);
router.get("/:id", getOfferById);
router.post("/", upload.single("background_image"), createOffer);
router.put("/:id", upload.single("background_image"), updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
