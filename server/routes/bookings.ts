import { Router } from "express";
import { createRequire } from "module";
import path from "path";
import { z } from "zod";
import nodemailer from "nodemailer";

const router = Router();

let prisma: any;
function getPrisma() {
  if (!prisma) {
    const require = createRequire(import.meta.url);
    const prismaPath = path.resolve(process.cwd(), "node_modules/.prisma/client/index.js");
    const { PrismaClient } = require(prismaPath);
    prisma = new PrismaClient();
  }
  return prisma;
}

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const createBookingSchema = z.object({
  eventTypeId: z.string(),
  eventTypeName: z.string(),
  bookerName: z.string(),
  bookerEmail: z.string().email(),
  scheduledFor: z.string(),
  duration: z.number(),
  meetingType: z.string(),
  meetingUrl: z.string().optional(),
});

// Create booking and send email
router.post("/", async (req, res) => {
  try {
    const db = getPrisma();
    const data = createBookingSchema.parse(req.body);

    const booking = await db.booking.create({
      data: {
        eventTypeId: data.eventTypeId,
        eventTypeName: data.eventTypeName,
        bookerName: data.bookerName,
        bookerEmail: data.bookerEmail,
        scheduledFor: new Date(data.scheduledFor),
        duration: data.duration,
        meetingType: data.meetingType,
        meetingUrl: data.meetingUrl,
        status: "confirmed",
      },
    });

    // Save to Database Log
    const emailLog = await db.emailLog.create({
      data: {
        to: data.bookerEmail,
        subject: `Booking Confirmed: ${data.eventTypeName}`,
        body: `Dear ${data.bookerName},\n\nYour booking for ${data.eventTypeName} is confirmed for ${new Date(data.scheduledFor).toLocaleString()}.\n\nMeeting link: ${data.meetingUrl || 'N/A'}\n\nThanks!`,
        type: "confirmation",
        bookingId: booking.id,
      },
    });

    // Send Real Email if Credentials Available
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: data.bookerEmail,
        subject: emailLog.subject,
        text: emailLog.body,
      });
      console.log(`Confirmation email actually sent to ${data.bookerEmail}`);
    } else {
      console.log("No GMAIL_USER or GMAIL_APP_PASSWORD set in .env. Email only logged to DB.");
    }

    res.status(201).json({ booking, emailLog });
  } catch (error: any) {
    console.error("Create Booking Error:", error);
    res.status(400).json({ error: error.message || "Invalid booking data" });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const db = getPrisma();
    const bookings = await db.booking.findMany({
      orderBy: { scheduledFor: "asc" },
    });
    res.json(bookings);
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Cancel booking
router.delete("/:id", async (req, res) => {
  try {
    const db = getPrisma();
    const id = req.params.id;

    const booking = await db.booking.update({
      where: { id },
      data: { status: "cancelled" },
    });

    // Save to Database Log
    const emailLog = await db.emailLog.create({
      data: {
        to: booking.bookerEmail,
        subject: `Booking Cancelled: ${booking.eventTypeName}`,
        body: `Dear ${booking.bookerName},\n\nYour booking for ${booking.eventTypeName} scheduled for ${new Date(booking.scheduledFor).toLocaleString()} has been cancelled.\n\nThanks!`,
        type: "cancellation",
        bookingId: booking.id,
      },
    });

    // Send Real Email if Credentials Available
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: booking.bookerEmail,
        subject: emailLog.subject,
        text: emailLog.body,
      });
      console.log(`Cancellation email actually sent to ${booking.bookerEmail}`);
    } else {
      console.log("No GMAIL_USER or GMAIL_APP_PASSWORD set in .env. Email only logged to DB.");
    }

    res.json({ success: true, booking });
  } catch (error: any) {
    console.error("Cancel Booking Error:", error);
    res.status(400).json({ error: "Failed to cancel booking" });
  }
});

export const bookingsRouter = router;
