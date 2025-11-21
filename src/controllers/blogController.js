import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();   // MUST BE HERE

export const createBlog = async (req, res) => {
  try {
    const { title, fullContent } = req.body;

    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = await prisma.blogPost.create({
      data: {
        title,
        fullContent,
        imageUrl,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Error creating blog post" });
  }
};

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

export const getBlogById = async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id: Number(req.params.id) },
    });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog post" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, fullContent } = req.body;
    const id = Number(req.params.id);

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    let imageUrl = existing.imageUrl;

    if (req.file) {
      if (existing.imageUrl) {
        const oldPath = path.join("uploads", existing.imageUrl.replace("/uploads/", ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        fullContent,
        imageUrl,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Error updating blog post" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (existing.imageUrl) {
      const filePath = path.join("uploads", existing.imageUrl.replace("/uploads/", ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog post" });
  }
};
