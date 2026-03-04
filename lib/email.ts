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
        <p style="color: #4a4640; line-height: 1.7;">Your reservation at YaffoTLV has been confirmed.</p>
        <div style="border-top: 1px solid #e8e3dc; border-bottom: 1px solid #e8e3dc; padding: 20px 0; margin: 24px 0;">
          <p style="margin: 8px 0; color: #2c2926;"><strong>Check-in:</strong> ${formatDateDisplay(checkIn)}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Check-out:</strong> ${formatDateDisplay(checkOut)}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Nights:</strong> ${nights}</p>
          <p style="margin: 8px 0; color: #2c2926;"><strong>Total:</strong> ${formatPrice(totalAmount)}</p>
          <p style="margin: 8px 0; color: #a69f95; font-size: 14px;">Ref: ${reservationId.slice(0, 8).toUpperCase()}</p>
        </div>
        <p style="color: #4a4640; line-height: 1.7;">We look forward to hosting you in Jaffa.</p>
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
