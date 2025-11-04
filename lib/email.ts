import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface ContactEmailProps {
  fullName: string;
  email: string;
  subject: string;
  projectDetails: string;
  contactType: string;
  attachment?: {
    filename: string;
    buffer: Buffer;
  };
}

// Send contact form email
export async function sendContactEmail({
  fullName,
  email,
  subject,
  projectDetails,
  contactType,
  attachment,
}: ContactEmailProps) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name:</div>
                <div class="value">${fullName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Contact Type:</div>
                <div class="value">${contactType}</div>
              </div>
              <div class="field">
                <div class="label">Project Details:</div>
                <div class="value">${projectDetails.replace(
                  /\n/g,
                  "<br>"
                )}</div>
              </div>
              ${
                attachment
                  ? `
              <div class="field">
                <div class="label">Attachment:</div>
                <div class="value">✓ File attached: ${attachment.filename}</div>
              </div>
              `
                  : ""
              }
            </div>
            <div class="footer">
              This email was sent from the Inovalink contact form.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // Add attachment if present
  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: attachment.buffer,
      },
    ];
  }

  await transporter.sendMail(mailOptions);
}

// Send waitlist confirmation email (optional)
export async function sendWaitlistConfirmation(email: string) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Inovalink Waitlist! 🎉",
    html: `
     <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .block {
              display: block;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin: 0px auto;
            }
            .header {
              background: #22c55e;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header h3 {
              margin: 10px 0 0;
              font-size: 20px;
              font-weight: normal;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              margin-top: 20px;
              border-radius: 8px;
            }
            .button {
              background: #22c55e;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header block">
              <h1>Congratulations 🎉</h1>
              <h3>You're on the list!</h3>
            </div>

            <div class="content">
              <p>Thank you for joining the Inovalink waitlist!</p>
              <p>
                We're working hard to bring you something amazing. You'll be among the
                first to know when we launch.
              </p>
              <p>Stay tuned for updates!</p>
              <p style="margin-top: 30px">
                Best regards,<br /><strong>The Inovalink Team</strong>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
