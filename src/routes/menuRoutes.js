import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPopularDishes
} from "../controllers/menuController.js";

const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct storage path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save inside backend/uploads (SAME AS SERVER.JS)
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getMenuItems);
router.get("/popular", getPopularDishes);
router.post("/", upload.single("image"), addMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
