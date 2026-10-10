import nodemailer from "nodemailer";

import { createLogger } from "@/logger/logger";

const log = createLogger("actions/smtp");

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  sender?: { name: string; email: string; replyTo: string[] },
  cc?: string[],
) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
      throw new Error("SMTP_HOST und SMTP_PORT sind nicht konfiguriert.");
    }
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const isLocalSmtp = ["127.0.0.1", "localhost", "::1"].includes(host);
    const smtpUser =
      process.env.SMTP_USER || (isLocalSmtp ? undefined : process.env.EMAIL);
    const smtpPassword =
      process.env.SMTP_PASSWORD ||
      (isLocalSmtp ? undefined : process.env.EMAIL_PASSWORD);
    if (!isLocalSmtp && (!smtpUser || !smtpPassword)) {
      throw new Error("SMTP-Zugangsdaten fehlen (EMAIL und EMAIL_PASSWORD).");
    }
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      ...(smtpUser && smtpPassword
        ? {
            auth: {
              user: smtpUser,
              pass: smtpPassword,
            },
          }
        : {}),
    });
    await transporter.sendMail({
      from: sender ? { name: sender.name, address: sender.email } : smtpUser,
      replyTo: sender?.replyTo,
      to, // list of receivers
      cc,
      subject, // Subject line
      html, // HTML body content
    });
  } catch (error) {
    log.error(JSON.stringify(error));
    throw error;
  }
}
