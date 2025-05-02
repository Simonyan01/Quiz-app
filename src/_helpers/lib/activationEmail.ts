import { accountActivationLink } from "../constants"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.NEXT_PUBLIC_API_URL,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendActivationEmail = async (to: string, name: string, surname: string): Promise<void> => {
  const mailOptions = {
    from: `"Quiz App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Activate Your Account Now",
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: linear-gradient(145deg, #ffffff, #f3f4f6); padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); color: #2d2d2d;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 5px;">Welcome to Our Service!</h1>
          <p style="font-size: 14px; color: #6b7280;">Activate your account to get started</p>
        </div>
        <p style="font-size: 17px; line-height: 1.7;">Hi <strong>${name} ${surname}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for signing up! We’re excited to have you on board. Click the button below to activate your account and unlock everything we have prepared for you.
        </p>       
        <div style="text-align: center; margin: 40px 0;">
          <a href="${accountActivationLink}" style="
            background: #2563eb;
            color: #ffffff;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 3px 6px rgba(37, 99, 235, 0.3);
            display: inline-block;
            transition: background 0.3s ease;">
            Activate Your Account
          </a>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">
          If you didn’t create an account with us, you can safely ignore this email.
        </p>
        <div style="margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} Quiz App. All rights reserved.<br>
            You received this email because you signed up for our service.
          </p>
        </div>
      </div>
      `,
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(`Error sending email:${err}`)
      return
    }
    console.log(info.response)
  })
}
