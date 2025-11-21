import express from "express";
import multer from "multer";
import {
  getReviews,
  addReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getReviews);
router.post("/", upload.single("img"), addReview);
router.delete("/:id", deleteReview);

export default router;
