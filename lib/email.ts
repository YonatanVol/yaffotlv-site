import { Resend } from "resend";
import { formatDateDisplay } from "./dates";
import { formatPrice } from "./pricing";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const HOST_EMAIL = "yonatanes1@gmail.com";
const FROM_EMAIL = "YaffoTLV <bookings@yaffotlv.com>";

export async function sendBookingConfirmation(params: {
  guestEmail: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  reservationId: string;
}) {
  const { guestEmail, guestName, checkIn, checkOut, nights, totalAmount, reservationId } = params;

  // Email to guest
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: guestEmail,
    subject: `Booking Confirmed - YaffoTLV`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 28px; font-weight: 300; color: #2c2926;">Booking Confirmed</h1>
        <p style="color: #4a4640; line-height: 1.7;">Dear ${guestName},</p>
        <p style="color: #4a4640; line-height: 1.7;">Your stay at YaffoTLV is confirmed.</p>
        <div style="border-top: 1px solid #e8e3dc; border-bottom: 1px solid #e8e3dc; padding: 20px 0; margin: 24px 0;">
          <p style="margin: 8px 0; color: #2c2926;"><strong>Check-in:</strong> ${formatDateDisplay(checkIn)}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Check-out:</strong> ${formatDateDisplay(checkOut)}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Nights:</strong> ${nights}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Total:</strong> ${formatPrice(totalAmount)}</p>
          <p style="margin: 8px 0; color: #a69f95; font-size: 14px;">Ref: ${reservationId.slice(0, 8).toUpperCase()}</p>
        </div>
        <p style="color: #4a4640; line-height: 1.7;">We're looking forward to hosting you in Jaffa. If you need anything before you arrive, just reply to this email.</p>
        <p style="color: #b8976a; font-style: italic;">YaffoTLV</p>
      </div>
    `,
  });

  // Notification to host
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: HOST_EMAIL,
    subject: `New Booking: ${guestName} (${formatDateDisplay(checkIn)} - ${formatDateDisplay(checkOut)})`,
    html: `
      <p><strong>New direct booking!</strong></p>
      <p>Guest: ${guestName} (${guestEmail})</p>
      <p>Dates: ${formatDateDisplay(checkIn)} - ${formatDateDisplay(checkOut)} (${nights} nights)</p>
      <p>Total: ${formatPrice(totalAmount)}</p>
      <p>Ref: ${reservationId.slice(0, 8).toUpperCase()}</p>
    `,
  });
}

export async function sendCancellationConfirmation(params: {
  guestEmail: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
}) {
  const { guestEmail, guestName, checkIn, checkOut } = params;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: guestEmail,
    subject: `Booking Cancelled - YaffoTLV`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 28px; font-weight: 300; color: #2c2926;">Booking Cancelled</h1>
        <p style="color: #4a4640;">Dear ${guestName},</p>
        <p style="color: #4a4640;">Your reservation at YaffoTLV (${formatDateDisplay(checkIn)} - ${formatDateDisplay(checkOut)}) has been cancelled and a full refund has been issued.</p>
        <p style="color: #b8976a; font-style: italic;">YaffoTLV</p>
      </div>
    `,
  });

  // Notify host
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: HOST_EMAIL,
    subject: `Cancellation: ${guestName} (${formatDateDisplay(checkIn)} - ${formatDateDisplay(checkOut)})`,
    html: `<p>Booking cancelled by ${guestName} (${guestEmail}) for ${formatDateDisplay(checkIn)} - ${formatDateDisplay(checkOut)}. Refund issued.</p>`,
  });
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yaffotlv.com";

/**
 * One-off nudge to a guest who started an enquiry but never finished it.
 * Carries a working unsubscribe link — required for commercial email, and the
 * token is what the /unsubscribe route matches on.
 */
export async function sendEnquiryFollowUp(params: {
  to: string;
  name: string | null;
  checkIn: string | null;
  checkOut: string | null;
  unsubscribeToken: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { to, name, checkIn, checkOut, unsubscribeToken } = params;
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;
  const dates =
    checkIn && checkOut
      ? `<p style="margin: 8px 0; color: #2c2926;"><strong>Your dates:</strong> ${formatDateDisplay(checkIn)} &rarr; ${formatDateDisplay(checkOut)}</p>`
      : "";

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Still thinking about Jaffa?",
      headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 26px; font-weight: 300; color: #2c2926;">Your stay is still available</h1>
          <p style="color: #4a4640; line-height: 1.7;">Hi${name ? ` ${name}` : ""},</p>
          <p style="color: #4a4640; line-height: 1.7;">
            You started booking our apartment in Jaffa but didn't finish. Your dates are still open —
            book direct and save 10% compared with the listing sites.
          </p>
          ${dates}
          <p style="margin: 28px 0;">
            <a href="${SITE_URL}/book" style="background: #b8976a; color: #fff; padding: 14px 28px; text-decoration: none; letter-spacing: 0.15em; font-size: 12px; text-transform: uppercase;">Finish your booking</a>
          </p>
          <p style="color: #4a4640; line-height: 1.7;">Any questions, just reply to this email.</p>
          <p style="color: #b8976a; font-style: italic;">Eitan &middot; YaffoTLV</p>
          <p style="color: #a69f95; font-size: 12px; margin-top: 32px;">
            You're receiving this because you entered your email while booking on yaffotlv.com.
            <a href="${unsubscribeUrl}" style="color: #a69f95;">Unsubscribe</a>
          </p>
        </div>
      `,
    });
    return { ok: true };
  } catch (error) {
    console.error("Follow-up email failed:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Send failed" };
  }
}

/** Monday morning summary of the week's traffic, funnel and enquiries. */
export async function sendWeeklyReport(params: {
  from: string;
  to: string;
  visits: number;
  uniqueVisitors: number;
  bookingsStarted: number;
  bookingsCompleted: number;
  newLeads: number;
  topReferrers: Array<{ source: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
}) {
  const { from, to, visits, uniqueVisitors, bookingsStarted, bookingsCompleted, newLeads } = params;
  const rows = (items: Array<{ count: number } & Record<string, unknown>>, key: string) =>
    items.length
      ? items
          .map(
            (i) =>
              `<tr><td style="padding: 4px 12px 4px 0; color: #4a4640;">${String(i[key] ?? "—")}</td><td style="padding: 4px 0; color: #2c2926;"><strong>${i.count}</strong></td></tr>`
          )
          .join("")
      : `<tr><td style="padding: 4px 0; color: #a69f95;">No data</td><td></td></tr>`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: HOST_EMAIL,
    subject: `YaffoTLV weekly report — ${visits} visits, ${newLeads} new enquiries`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 26px; font-weight: 300; color: #2c2926;">Weekly report</h1>
        <p style="color: #a69f95; font-size: 14px;">${from} &rarr; ${to}</p>
        <table style="margin: 24px 0; border-collapse: collapse;">
          <tr><td style="padding: 6px 16px 6px 0; color: #4a4640;">Visits</td><td style="color: #2c2926;"><strong>${visits}</strong></td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #4a4640;">Unique visitors</td><td style="color: #2c2926;"><strong>${uniqueVisitors}</strong></td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #4a4640;">Started booking</td><td style="color: #2c2926;"><strong>${bookingsStarted}</strong></td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #4a4640;">Completed booking</td><td style="color: #2c2926;"><strong>${bookingsCompleted}</strong></td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #4a4640;">New enquiries (not finished)</td><td style="color: #2c2926;"><strong>${newLeads}</strong></td></tr>
        </table>
        <h2 style="font-size: 16px; font-weight: 400; color: #2c2926;">Where visitors came from</h2>
        <table style="border-collapse: collapse;">${rows(params.topReferrers, "source")}</table>
        <h2 style="font-size: 16px; font-weight: 400; color: #2c2926; margin-top: 24px;">Most viewed pages</h2>
        <table style="border-collapse: collapse;">${rows(params.topPages, "path")}</table>
        <p style="margin-top: 28px;">
          <a href="${SITE_URL}/admin/leads" style="color: #b8976a;">Review enquiries in the admin &rarr;</a>
        </p>
      </div>
    `,
  });
}

/**
 * Immediate heads-up about enquiries that left a contact detail. Sent by the
 * hourly job, and only when there is actually something new — silence means
 * nothing happened, so the mail is always worth opening.
 */
export async function sendLeadAlert(params: {
  leads: Array<{
    email: string | null;
    name: string | null;
    phone: string | null;
    checkIn: string | null;
    checkOut: string | null;
    guests: number | null;
    stage: string;
  }>;
}) {
  const { leads } = params;
  const stageLabel: Record<string, string> = {
    typed_email: "left after entering contact details",
    filled_details: "filled in their details",
    submitted: "sent a request",
  };

  const items = leads
    .map((l) => {
      const who = l.name || l.email || l.phone || "Someone";
      const contact = [
        l.email ? `<a href="mailto:${l.email}" style="color:#b8976a;">${l.email}</a>` : "",
        l.phone
          ? `<a href="https://wa.me/${l.phone.replace(/\D/g, "")}" style="color:#b8976a;">${l.phone}</a>`
          : "",
      ]
        .filter(Boolean)
        .join(" &middot; ");
      const dates =
        l.checkIn && l.checkOut
          ? `${formatDateDisplay(l.checkIn)} &rarr; ${formatDateDisplay(l.checkOut)}${l.guests ? `, ${l.guests} guests` : ""}`
          : "no dates chosen";
      return `
        <div style="border-bottom: 1px solid #e8e3dc; padding: 14px 0;">
          <p style="margin: 0; color: #2c2926; font-size: 16px;"><strong>${who}</strong></p>
          <p style="margin: 4px 0; color: #4a4640;">${contact || "no contact details"}</p>
          <p style="margin: 4px 0; color: #4a4640;">${dates}</p>
          <p style="margin: 4px 0; color: #a69f95; font-size: 13px;">${stageLabel[l.stage] ?? l.stage}</p>
        </div>`;
    })
    .join("");

  const count = leads.length;
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: HOST_EMAIL,
    subject: count === 1 ? "New enquiry on yaffotlv.com" : `${count} new enquiries on yaffotlv.com`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 300; color: #2c2926;">
          ${count === 1 ? "Someone just enquired" : `${count} people just enquired`}
        </h1>
        <p style="color: #4a4640; line-height: 1.7;">They left contact details on the booking form but haven't confirmed a stay.</p>
        ${items}
        <p style="margin-top: 24px;">
          <a href="${SITE_URL}/admin/leads" style="color: #b8976a;">Open enquiries in the admin &rarr;</a>
        </p>
      </div>
    `,
  });
}
