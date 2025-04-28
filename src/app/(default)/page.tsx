"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HomePage() {
    const [_, setIsSmallScreen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768)
        }

        handleResize()
        addEventListener("resize", handleResize)
        return () => removeEventListener("resize", handleResize)
    }, [])
    return (
        <section className="relative min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.3, scale: 1.2 }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute top-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-20"
            />
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "linear" }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold relative z-10"
            >
                Learn {" "}
                <motion.span
                    className="text-green-500 inline-block relative"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                >
                    10x Faster!
                </motion.span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "linear", delay: 0.3 }}
                className="text-lg md:text-xl text-gray-300 mt-3 tracking-wider text-center z-10"
            >
                Unlock Your Potential with Personalized Quizzes
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "linear", delay: 0.6 }}
                className="mt-6"
            >
                <Link href="/sign-up">
                    <motion.div
                        className="px-6 py-3 cursor-pointer tracking-wider text-gray-200 text-lg font-semibold rounded-lg shadow-md relative"
                        initial={{ backgroundColor: "rgb(29, 145, 62)" }}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgb(29, 145, 02)" }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        Get Started Now!
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    )
}
