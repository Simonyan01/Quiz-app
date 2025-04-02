import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/_components/layout/Navbar"
import type { Metadata } from "next"
import "./global.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Quiz App",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
