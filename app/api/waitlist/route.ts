import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWaitlistConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1].toLowerCase();
    const allowedDomains = [
      "gmail.com",
      "icloud.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "yandex.com",
    ];

    if (!allowedDomains.includes(domain)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please use a valid email provider (e.g., Gmail, iCloud, Outlook, Yahoo, etc.)",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.waitlistUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered!" },
        { status: 409 }
      );
    }

    // Add to database
    await prisma.waitlistUser.create({
      data: {
        email: email.toLowerCase(),
      },
    });

    // Send confirmation email
    try {
      await sendWaitlistConfirmation(email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Successfully joined the waitlist!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const emails = await prisma.waitlistUser.findMany({
      select: { email: true },
    });

    const initials = emails.map((item) => item.email[0].toUpperCase());
    const count = emails.length;

    return NextResponse.json({
      success: true,
      count,
      initials,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch waitlist data." },
      { status: 500 }
    );
  }
}