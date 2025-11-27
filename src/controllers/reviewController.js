import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary.js";   // <--- added
import fs from "fs";

const prisma = new PrismaClient();

// GET ALL REVIEWS
export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { id: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

// ADD A REVIEW
export const addReview = async (req, res) => {
  try {
    const { name, rating, text } = req.body;

    let img = null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "dinefine/reviews",
      });

      img = upload.secure_url;

      fs.unlinkSync(req.file.path); // remove temp file
    }

    const newReview = await prisma.review.create({
      data: {
        name,
        rating: Number(rating),
        text,
        img,
        date: new Date().toDateString(),
      },
    });

    res.json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding review" });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting review" });
  }
};
