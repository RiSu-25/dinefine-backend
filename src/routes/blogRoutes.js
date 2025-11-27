// routes/blogRoutes.js
import express from "express";
import multer from "multer";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blogController.js";

const router = express.Router();

// Multer config for temporary storage
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
