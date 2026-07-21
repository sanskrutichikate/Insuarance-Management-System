import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Insurance Management API is running...");
});

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

app.get(
  "/api/agent",
  authMiddleware,
  roleMiddleware("AGENT"),
  (req, res) => {
    res.json({
      message: "Welcome Admin"
    });
  }
);

app.get(
  "/api/customer",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  (req, res) => {
    res.json({
      message: "Welcome Admin"
    });
  }
);

app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin"
    });
  }
);

async function connectDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database Connected Successfully!");
    console.log("Database Time:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});