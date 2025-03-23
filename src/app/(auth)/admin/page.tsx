"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IUser, METHODS } from "@/_helpers/lib/types"
import { useRouter } from "next/navigation"
import { Loader } from "@/_components/Loader"
import { Layout } from "@/_components/Layout"

export default function AdminPage() {
    const router = useRouter()
    const [logout] = useHttpMutation(() => router.push("/sign-in"))
    const { data, loading } = useHttpQuery<IUser>("/api/auth")
    const { name, surname, role } = data ?? {}

    const handleLogout = () => {
        try {
            logout("/api/logout", METHODS.POST)
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return (
        <Layout>
            <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader isLoading={loading} />
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-600">
                    <h2 className="text-2xl font-bold text-indigo-400 mb-4 text-center">
                        Admin Dashboard
                    </h2>
                    {!data ? (
                        <p className="text-red-400">Տվյալները հասանելի չեն</p>
                    ) : (
                        <>
                            <p><span className="font-semibold">Անուն:</span> {name}</p>
                            <p><span className="font-semibold">Ազգանուն:</span> {surname}</p>
                            <p><span className="font-semibold">Դեր:</span> {role}</p>
                        </>
                    )}
                    {data && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-white p-2 cursor-pointer bg-red-600 hover:bg-red-700 mt-4 rounded-lg text-xl tracking-wider"
                        >
                            {loading ? "Logging out..." : "Logout"}
                        </button>
                    )}
                </div>
            </section>
        </Layout>
    )
}
