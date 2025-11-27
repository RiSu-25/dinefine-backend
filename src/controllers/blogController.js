import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const prisma = new PrismaClient();

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { title, fullContent } = req.body;

    let imageUrl = null;

    // If an image is uploaded
    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "dinefine/blogs",
        });
        imageUrl = upload.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary Upload Error:", cloudErr);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    }

    const blog = await prisma.blogPost.create({
      data: { title, fullContent, imageUrl },
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Error creating blog post" });
  }
};

// GET ALL BLOGS
export const getBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

// GET BLOG BY ID
export const getBlogById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const blog = await prisma.blogPost.findUnique({ where: { id } });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog post" });
  }
};

// UPDATE BLOG
export const updateBlog = async (req, res) => {
  try {
    const { title, fullContent } = req.body;
    const id = Number(req.params.id);

    const existing = await prisma.blogPost.findUnique({ where: { id } });

    if (!existing)
      return res.status(404).json({ message: "Blog does not exist" });

    let imageUrl = existing.imageUrl;

    if (req.file) {
      try {
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "dinefine/blogs",
        });
        imageUrl = upload.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary Upload Error:", cloudErr);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: { title, fullContent, imageUrl },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Error updating blog post" });
  }
};

// DELETE BLOG
export const deleteBlog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Blog not found" });

    await prisma.blogPost.delete({ where: { id } });

    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Error deleting blog post" });
  }
};
