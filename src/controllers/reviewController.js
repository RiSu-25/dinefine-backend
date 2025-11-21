import { PrismaClient } from "@prisma/client";
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

    const img = req.file ? req.file.filename : null;

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
