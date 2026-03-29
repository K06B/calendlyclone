import { Router } from "express";
import { createRequire } from "module";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-123";

let prisma: any;
function getPrisma() {
  if (!prisma) {
    console.log("DATABASE_URL is:", process.env.DATABASE_URL);
    const require = createRequire(import.meta.url);
    const prismaPath = path.resolve(process.cwd(), "node_modules/.prisma/client/index.js");
    const { PrismaClient } = require(prismaPath);
    prisma = new PrismaClient();
  }
  return prisma;
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register Account
router.post("/register", async (req, res) => {
  try {
    const db = getPrisma();
    const data = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create user in postgres/sqlite
    const user = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.email.split("@")[0],
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(400).json({ error: error.message || "Invalid or incomplete registration data." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const db = getPrisma();
    const data = loginSchema.parse(req.body);

    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
       res.status(401).json({ error: "Invalid email or password." });
       return;
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
       res.status(401).json({ error: "Invalid email or password." });
       return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(400).json({ error: error.message || "Invalid login format." });
  }
});

export const authRouter = router;
