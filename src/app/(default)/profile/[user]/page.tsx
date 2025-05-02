"use client"

import { UserProfile } from "@/_components/user/UserPage"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { IUser } from "@/_helpers/types/types"
import { useParams } from "next/navigation"

export default function UserPage() {
    const { user } = useParams()
    const { data, loading } = useHttpQuery<IUser>(`/api/users/${user}`)
    const { name, surname, role, image } = data ?? {}

    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
                <div className="bg-gray-800/70 backdrop-blur-md p-7 rounded-2xl shadow w-full max-w-md">
                    <h1 className="text-4xl font-extrabold text-center mb-7 tracking-wide text-white">
                        {name ?? "User"}&apos;s Profile
                    </h1>
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded"></div>
                            <div className="h-6 bg-gray-700 rounded"></div>
                            <div className="h-6 bg-gray-700 rounded"></div>
                        </div>
                    ) : (
                        <UserProfile
                            name={name}
                            surname={surname}
                            role={role}
                            image={image!}
                        />
                        /* {achievements && achievements.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
                            <ul className="space-y-3">
                                {achievements.map((achievement, index) => (
                                    <li key={index} className="bg-gray-700/60 p-4 rounded-lg shadow-md">
                                        <span className="text-gray-300 text-sm">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        )} */
                    )}
                </div>
            </div>
        </Layout>
    )
}