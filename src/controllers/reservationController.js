import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// CREATE reservation
export const createReservation = async (req, res) => {
  try {
    const { name, email, phone, guests, date, time, message } = req.body;

    const newReservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        guests: Number(guests),
        date: new Date(date),
        time,
        message,
      },
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

// GET all reservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

// UPDATE reservation (status or details)
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.reservation.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update reservation" });
  }
};

// DELETE reservation
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.reservation.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reservation" });
  }
};
