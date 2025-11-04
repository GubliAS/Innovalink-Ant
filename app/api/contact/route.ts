import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";

// File size limit: 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const projectDetails = formData.get("projectDetails") as string;
    const contactType = formData.get("contactType") as string;
    const file = formData.get("attachment") as File | null;

    // Validate required fields
    if (!fullName || !email || !subject || !projectDetails || !contactType) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
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

    // Validate contact type
    if (!["Individual", "Business"].includes(contactType)) {
      return NextResponse.json(
        { success: false, message: "Invalid contact type" },
        { status: 400 }
      );
    }

    let attachment: { filename: string; buffer: Buffer } | undefined =
      undefined;

    // Process file if present
    if (file && file.size > 0) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "File size must be less than 25MB" },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Allowed: PDF, PPT, XLS, JPG",
          },
          { status: 400 }
        );
      }

      // Convert file to buffer for email attachment
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      attachment = {
        filename: file.name,
        buffer: buffer,
      };
    }

    // Save to database
    await prisma.contactSubmission.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        subject,
        projectDetails,
        contactType: contactType.toUpperCase() as "INDIVIDUAL" | "BUSINESS",
        hasAttachment: !!attachment,
        attachmentName: attachment?.filename || null,
      },
    });

    // Send email to admin
    await sendContactEmail({
      fullName,
      email,
      subject,
      projectDetails,
      contactType,
      attachment,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We will get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
