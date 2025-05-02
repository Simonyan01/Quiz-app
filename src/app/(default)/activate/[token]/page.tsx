"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { BiCheckCircle } from "react-icons/bi"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ActivationPage() {
    const { token } = useParams() as { token: string }
    const { loading, error } = useHttpQuery(`/api/auth/activate/${token}`, !!token)

    const renderContent = () => {
        if (loading) return <p className="text-gray-300">Activating your account...</p>
        if (!loading && !error) {
            return (
                <>
                    <BiCheckCircle className="text-green-400 w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-gray-100">Account Activated!</h1>
                    <p className="text-gray-400 mb-3">
                        Your account has been successfully activated. <br />You may now proceed to log in and explore your personalized dashboard.
                    </p>
                    <Link href="/sign-in" className="text-[#f09819] hover:text-[#ff5330] transition-all duration-200 font-semibold">
                        Go to Login
                    </Link>
                </>
            )
        }

        return (
            <>
                <p className="text-red-400 font-semibold text-xl">Invalid or expired activation link.</p>
                <Link href="/" className="text-[#f09819] hover:text-[#ff5330] transition-all duration-200 font-semibold mt-6">
                    Back to Home
                </Link>
            </>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 shadow-xs rounded-2xl py-5 px-0 max-w-md w-full text-lg text-center"
            >
                {renderContent()}
            </motion.div>
        </div>
    )
}
