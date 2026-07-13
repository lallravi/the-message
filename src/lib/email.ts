import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  if (!resend) {
    // No email provider configured — print the link so local dev can still
    // complete the verification flow without a real inbox.
    console.log(
      `\n[dev email] Verification link for ${to}:\n${verifyUrl}\n`
    );
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "The Message <onboarding@resend.dev>",
    to,
    subject: "Verify your email — The Message",
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#4b3b2a;">The Message of the Hour</h2>
        <p>Thank you for signing up. Please confirm your email address to activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;background:#8a5a2c;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
            Verify my email
          </a>
        </p>
        <p style="color:#666;font-size:13px;">If the button doesn't work, copy and paste this link into your browser:<br/>${verifyUrl}</p>
      </div>
    `,
  });
}
