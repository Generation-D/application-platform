"use server";

import nodemailer from "nodemailer";

import { createLogger } from "@/logger/logger";

const log = createLogger("actions/smtp");

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  sender?: { name: string; email: string; replyTo: string[] },
) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
      throw new Error("SMTP_HOST und SMTP_PORT sind nicht konfiguriert.");
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          }
        : {}),
    });
    await transporter.sendMail({
      from: sender
        ? { name: sender.name, address: sender.email }
        : process.env.SMTP_USER,
      replyTo: sender?.replyTo,
      to, // list of receivers
      subject, // Subject line
      html, // HTML body content
    });
  } catch (error) {
    log.error(JSON.stringify(error));
    throw error;
  }
}
