import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const HOST_EMAIL = "yonatanes1@gmail.com";
const FROM_EMAIL = "YaffoTLV <bookings@yaffotlv.com>";
const WHATSAPP_NUMBER = "972528701670";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Log contact submission
    console.log("[Contact] New submission:", { name, email, message: message.slice(0, 100) });

    // Send email notification to host
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: HOST_EMAIL,
      subject: `New Contact: ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 300; color: #2c2926;">New Contact Message</h1>
          <div style="border-top: 1px solid #e8e3dc; border-bottom: 1px solid #e8e3dc; padding: 20px 0; margin: 24px 0;">
            <p style="margin: 8px 0; color: #2c2926;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #2c2926;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 16px 0 8px; color: #2c2926;"><strong>Message:</strong></p>
            <p style="margin: 0; color: #4a4640; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #a69f95; font-size: 14px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
      replyTo: email,
    });

    // Send auto-reply to guest
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Thank you for contacting YaffoTLV",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 28px; font-weight: 300; color: #2c2926;">Thank You</h1>
          <p style="color: #4a4640; line-height: 1.7;">Dear ${name},</p>
          <p style="color: #4a4640; line-height: 1.7;">Thank you for reaching out. We've received your message and will get back to you as soon as possible.</p>
          <p style="color: #4a4640; line-height: 1.7;">For a quicker response, you can also reach us on WhatsApp:</p>
          <p style="margin: 16px 0;">
            <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color: #b8976a; text-decoration: none;">Message us on WhatsApp</a>
          </p>
          <p style="color: #b8976a; font-style: italic;">YaffoTLV</p>
        </div>
      `,
    });

    // WhatsApp-formatted notification summary (for easy copy)
    const whatsappSummary = [
      `*New Contact from YaffoTLV Website*`,
      ``,
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Message:* ${message}`,
      ``,
      `_Reply via:_ https://wa.me/${WHATSAPP_NUMBER}`,
    ].join("\n");

    console.log("[Contact] WhatsApp summary:\n", whatsappSummary);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
