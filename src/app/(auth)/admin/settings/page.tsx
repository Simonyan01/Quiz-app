"use client"

import { useRouter } from 'next/navigation'
import {Layout} from '@/_components/Layout'
import { useState } from 'react'

export default function Settings() {
    const router = useRouter()
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        console.log("Password changed successfully")
        router.push("/admin/dashboard")
    }

    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Change Password</h2>
                    {error && (
                        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="oldPassword">Old Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
