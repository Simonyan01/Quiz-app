"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { IUser } from "@/_helpers/types/types"

export default function Users() {
    const { data: users, loading, error } = useHttpQuery<IUser[]>("/api/users")

    return (
        <Layout>
            <Loader isLoading={loading} />
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
                <h1 className="text-4xl font-bold text-indigo-400 mb-8">Users List</h1>
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
                        <p className="text-lg font-semibold">⚠ Oops! Something went wrong.</p>
                        <p className="text-sm mt-2 opacity-80">{error || "Failed to load users."}</p>
                    </div>
                )}
                {users?.length === 0 && (
                    <div className="text-gray-400 text-xl mt-10">No users found.</div>
                )}
                {users?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map(({ id, login, role }) => (
                            <div
                                key={id}
                                className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 w-max text-center"
                            >
                                <h2 className="text-2xl font-semibold text-indigo-300">{login}</h2>
                                <p className={`mt-2 text-lg font-medium ${role === "admin" ? "text-red-400" : "text-green-400"}`}>
                                    {role.toUpperCase()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
