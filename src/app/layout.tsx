// import { AuthProvider } from "@/_helpers/context/AuthContext"
import { Geist, Geist_Mono } from "next/font/google"
import Navbar from "@/_components/Navbar"
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        {/* <AuthProvider> */}
        <Navbar />
        {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
