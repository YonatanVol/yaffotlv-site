import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const HOST_EMAIL = "yonatanes1@gmail.com";
const FROM_EMAIL = "YaffoTLV <bookings@yaffotlv.com>";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: HOST_EMAIL,
      replyTo: email,
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 300; color: #2c2926;">New Contact Inquiry</h1>
          <div style="border-top: 1px solid #e8e3dc; border-bottom: 1px solid #e8e3dc; padding: 20px 0; margin: 24px 0;">
            <p style="margin: 8px 0; color: #2c2926;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #2c2926;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #2c2926;"><strong>Message:</strong></p>
            <p style="margin: 8px 0; color: #4a4640; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #a69f95; font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
          <p style="color: #b8976a; font-style: italic;">YaffoTLV</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
