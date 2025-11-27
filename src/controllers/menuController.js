import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary.js"; // <--- added
import fs from "fs"; 
const prisma = new PrismaClient();

// GET ALL MENU ITEMS
export const getMenuItems = async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany();
    res.json(items);
  } catch (error) {
    console.error("GET Menu Error:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// ADD NEW MENU ITEM
export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, status, isPopular } = req.body;

    let imageUrl = null;

    // Upload image to Cloudinary if exists
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "dinefine/menu",
      });

      imageUrl = upload.secure_url;

      // remove file from local uploads folder
      fs.unlinkSync(req.file.path);
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        status,
        imageUrl,
        isPopular: isPopular === "true" || isPopular === true,
      },
    });

    res.json(newItem);
  } catch (error) {
    console.error("ADD Menu Error:", error);
    res.status(500).json({ error: "Failed to add menu item" });
  }
};

// UPDATE MENU ITEM
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, status, isPopular } = req.body;

    let imageUrl = req.body.imageUrl; // keep old URL

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "dinefine/menu",
      });

      imageUrl = upload.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updated = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        status,
        imageUrl,
        isPopular: isPopular === "true" || isPopular === true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE Menu Error:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

// DELETE MENU ITEM
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.menuItem.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("DELETE Menu Error:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};

// GET POPULAR DISHES
export const getPopularDishes = async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isPopular: true },
    });
    res.json(items);
  } catch (error) {
    console.error("GET Popular Error:", error);
    res.status(500).json({ error: "Failed to fetch popular dishes" });
  }
};
