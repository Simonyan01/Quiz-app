"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import useImageUpload from "@/_helpers/hooks/useImageUpload"
import { IUser, METHODS } from "@/_helpers/lib/types"
import { defaultAvatar } from "@/_helpers/constants"
import ImagePicker from "@/_components/ImagePicker"
import { useRouter } from "next/navigation"
import { Loader } from "@/_components/Loader"
import { Layout } from "@/_components/Layout"
import "../../(default)/global.css"
import { useState } from "react"
import Image from "next/image"
import "./global.css"

export default function UserPage() {
    const router = useRouter()
    const [handleImageSubmit] = useImageUpload()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [logout] = useHttpMutation(() => router.push("/sign-in"))
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const { data, loading, refetch } = useHttpQuery<IUser>("/api/auth")
    const { id, name, surname, role, image } = data ?? {}

    const handleImageSelect = (image: File) => {
        setSelectedImage(image)
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleLogOut = () => {
        try {
            logout("/api/logout", METHODS.POST)
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    const handleSubmit = () => {
        if (selectedImage) {
            handleImageSubmit(selectedImage, id)
            setTimeout(() => refetch(), 300)
            setIsModalOpen(false)
        }
    }

    return (
        <Layout>
            <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
                <Loader isLoading={loading} />
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl border border-gray-600">
                    <div className="flex items-center gap-12">
                        <Image
                            src={image ?? defaultAvatar}
                            onClick={handleOpenModal}
                            alt="User Avatar"
                            className="size-20 rounded-full border-4 cursor-pointer bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
                            width={150}
                            height={150}
                            priority
                        />
                        {!data ? (
                            <div className="bg-gradient-to-r from-red-500 to-red-800 tracking-wide text-gray-200 p-4 rounded-lg text-center font-semibold shadow-lg text-xl">
                                Data isn't available yet 🚨
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-4xl font-bold text-amber-50">{name} {surname}</h2>
                                <p className="text-gray-300">{role}</p>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 tracking-wide">
                        <button
                            type="button"
                            onClick={() => router.push("/user/quizzes")}
                            className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-all cursor-pointer">
                            Quizzes
                        </button>
                    </div>
                    {data && (
                        <button
                            type="button"
                            onClick={handleLogOut}
                            className="w-full p-2 text-gray-200 font-semibold btn-grad cursor-pointer mt-6 rounded-lg text-2xl tracking-wider"
                        >
                            {loading && !data ? "Logging out..." : "Logout"}
                        </button>
                    )}
                </div>
            </section>
            <div className={`modal-overlay ${isModalOpen ? "open" : ""}`}>
                <div className={`modal-content ${isModalOpen ? "open" : ""} shadow-xl border border-gray-700`}>
                    <ImagePicker
                        image={image}
                        setOpen={setIsModalOpen}
                        defaultAvatar={defaultAvatar}
                        onImageSelect={handleImageSelect}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </Layout>
    )
}
