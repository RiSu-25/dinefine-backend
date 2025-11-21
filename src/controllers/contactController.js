import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ADD CONTACT MESSAGE
export const addContact = async (req, res) => {
  try {
    const contact = await prisma.contact.create({
      data: req.body,
    });

    res.status(201).json(contact);
  } catch (error) {
    console.log("Error adding contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL CONTACT MESSAGES
export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(contacts);
  } catch (error) {
    console.log("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE CONTACT MESSAGE
export const deleteContact = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.contact.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete" });
  }
};
