import { Resend } from "resend";

const HOST_EMAIL = "yonatanes1@gmail.com";
const FROM_EMAIL = "YaffoTLV <bookings@yaffotlv.com>";

/**
 * Email the host when a critical background path fails — payment webhook, refund,
 * or calendar sync — so a 2am failure isn't silent. Best-effort and never throws:
 * a failing alert must not break the caller.
 *
 * (Lightest option, reusing the existing Resend dependency. A hosted error tracker
 * like Sentry can be layered on later if richer alerting is wanted.)
 */
export async function alertHost(subject: string, detail: string): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(`[alert suppressed — no RESEND_API_KEY] ${subject}: ${detail}`);
      return;
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: HOST_EMAIL,
      subject: `[YaffoTLV alert] ${subject}`,
      text: detail,
    });
  } catch (e) {
    console.error("Failed to send alert email:", e, "\nOriginal alert:", subject, detail);
  }
}
