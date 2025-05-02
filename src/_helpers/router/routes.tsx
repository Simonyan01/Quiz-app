"use client"

import { MdOutlineQuiz, MdOutlineVerifiedUser } from "react-icons/md"
import { CiLogout, CiSettings } from "react-icons/ci"
import { TbReportAnalytics } from "react-icons/tb"
import { IoHomeOutline } from "react-icons/io5"

export const getMenuItems = (role: string | undefined, handleLogout: () => void) => {
  return role === "admin"
    ? [
      { path: "/admin", label: "Dashboard", icons: <IoHomeOutline size={30} /> },
      { path: "/admin/quizzes", label: "Quizzes", icons: <MdOutlineQuiz size={30} /> },
      { path: "/admin/quiz-results", label: "Statistics", icons: <TbReportAnalytics size={30} /> },
      { path: "/profile", label: "Users", icons: <MdOutlineVerifiedUser size={30} /> },
      { path: "/admin/settings", label: "Settings", icons: <CiSettings size={30} /> },
      { path: "", label: "Logout", icons: <CiLogout size={30} />, action: handleLogout },
    ]
    : [
      { path: "/user", label: "Profile", icons: <IoHomeOutline size={30} /> },
      { path: "/user/quizzes", label: "Quizzes", icons: <MdOutlineQuiz size={30} /> },
      { path: "/user/quiz-results", label: "Statistics", icons: <TbReportAnalytics size={30} /> },
      { path: "/profile", label: "Users", icons: <MdOutlineVerifiedUser size={30} /> },
      { path: "/user/settings", label: "Settings", icons: <CiSettings size={30} /> },
      { path: "", label: "Logout", icons: <CiLogout size={30} />, action: handleLogout },
    ]
}
