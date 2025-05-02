import { Role } from "../types/types"
import nodemailer from "nodemailer"

interface QuizPassedEmailProps {
  to: string
  name: string
  quizTitle: string
  score: number
  role: Role
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.NEXT_PUBLIC_API_URL,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendQuizPassedEmail = async ({ to, name, quizTitle, score, role }: QuizPassedEmailProps): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const dashboardUrl = `${baseUrl}/${role}/quizzes`
  const mailOptions = {
    from: `"Quiz App" <${process.env.SMTP_USER}>`,
    to,
    subject: "🎉 You passed the quiz!",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9fafb; border-radius: 10px; padding: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #10b981; margin-bottom: 10px;">Congratulations, ${name}! 🎉</h1>
        <p style="font-size: 18px; color: #374151;">You’ve passed the quiz with flying colors!</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px;">
        <h2 style="color: #111827; margin-bottom: 10px;">📘 Quiz Details</h2>
        <p style="margin: 0; font-size: 16px; color: #4b5563;"><strong>Title:</strong> ${quizTitle}</p>
        <p style="margin: 5px 0 15px; font-size: 16px; color: #4b5563;"><strong>Score:</strong> ${score}</p>
        <a href="${dashboardUrl}" 
           style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Take Another One 🚀
        </a>
      </div>
      <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280;">
        Keep learning, stay curious. You're doing great!
      </p> 
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
