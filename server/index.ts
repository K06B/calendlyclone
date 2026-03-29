import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { authRouter } from "./routes/auth";
import { bookingsRouter } from "./routes/bookings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check (important for testing)
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Routes
  app.get("/api/demo", handleDemo);
  app.use("/api/auth", authRouter);
  app.use("/api/bookings", bookingsRouter);

  // ✅ SAFE fallback (NO wildcard crash)
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return app;
}

// Start server
const app = createServer();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});