
import express from "express";
import cors from "cors";
import { z } from "zod";
import { pool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

const statusSchema = z.enum(["New", "In Progress", "Resolved"]);

const createInquirySchema = z.object({
  customer: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(150),
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
});

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      message: "Inquiro Tracker API is running",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// Get all inquiries
app.get("/api/inquiries", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        customer,
        contact,
        subject,
        description,
        status,
        TO_CHAR(created_at, 'YYYY-MM-DD') AS date
      FROM inquiries
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries." });
  }
});

// Create a new inquiry
app.post("/api/inquiries", async (req, res) => {
  const validation = createInquirySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid inquiry data.",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const { customer, contact, subject, description } = validation.data;

    const result = await pool.query(
      `INSERT INTO inquiries
        (customer, contact, subject, description)
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         customer,
         contact,
         subject,
         description,
         status,
         TO_CHAR(created_at, 'YYYY-MM-DD') AS date`,
      [customer, contact, subject, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Failed to create inquiry." });
  }
});

// Update inquiry status
app.patch("/api/inquiries/:id/status", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "A valid inquiry ID is required.",
    });
    return;
  }

  const validation = z
    .object({ status: statusSchema })
    .safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "A valid status is required.",
      allowedStatuses: ["New", "In Progress", "Resolved"],
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE inquiries
       SET status = $1
       WHERE id = $2
       RETURNING
         id,
         customer,
         contact,
         subject,
         description,
         status,
         TO_CHAR(created_at, 'YYYY-MM-DD') AS date`,
      [validation.data.status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Inquiry not found." });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Failed to update inquiry." });
  }
});

// Handle unknown API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`Inquiro Tracker API running at http://localhost:${PORT}`);
});
