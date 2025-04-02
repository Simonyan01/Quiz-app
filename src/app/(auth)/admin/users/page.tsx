"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { defaultAvatar } from "@/_helpers/constants"
import { Loader } from "@/_components/UI/Loader"
import { IUser } from "@/_helpers/types/types"
import Image from "next/image"

export default function Users() {
    const { data: users, loading, error } = useHttpQuery<IUser[]>("/api/users")

    const renderError = error && (
        <div className="bg-red-500 text-white tracking-wide p-4 rounded-lg shadow-md w-full max-w-md text-center">
            <p className="text-lg font-semibold">⚠ Oops! Something went wrong.</p>
        </div>
    )

    const renderNoUsers = !loading && !users.length && (
        <div className="text-gray-400 text-xl mt-10">No users found.</div>
    )

    const renderUsers = users?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-8">
            {users.map(({ id, login, role, image }) => (
                <div
                    key={id}
                    className="bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-200 transform hover:-translate-y-2 min-w-max text-center"
                >
                    <Image
                        src={image ?? defaultAvatar}
                        alt={`${login}'s avatar`}
                        className="size-20 rounded-full mx-auto mb-4 border-4 shadow-lg bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
                        width={150}
                        height={150}
                        priority
                    />
                    <h2 className="text-2xl font-semibold text-indigo-300">{login}</h2>
                    <p className={`mt-2 text-lg font-medium tracking-wide ${role === "admin" ? "text-red-400" : "text-green-400"}`}>
                        {role.toUpperCase()}
                    </p>
                </div>
            ))}
        </div>
    )

    return (
        <Layout>
            <Loader isLoading={loading} />
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
                <h1 className="text-4xl font-bold text-indigo-400 mb-8">Users List</h1>
                {renderError}
                {renderNoUsers}
                {renderUsers}
            </div>
        </Layout>
    )
}
