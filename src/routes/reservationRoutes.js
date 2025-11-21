import express from "express";
import {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservation);        // Create
router.get("/", getReservations);           // Get all
router.put("/:id", updateReservation);      // Update
router.delete("/:id", deleteReservation);   // Delete

export default router;
