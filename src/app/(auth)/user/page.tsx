"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IQuizResult, IUser, METHODS } from "@/_helpers/types/types"
import { useImageUpload } from "@/_helpers/hooks/useImageUpload"
import { ImagePicker } from "@/_components/UI/ImagePicker"
import { Logout } from "@/_components/common/LogoutButton"
import { Layout } from "@/_components/layout/Layout"
import { defaultAvatar } from "@/_helpers/constants"
import { Actions } from "@/_components/user/Actions"
import { Loader } from "@/_components/UI/Loader"
import { useRouter } from "next/navigation"
import "@/app/(default)/global.css"
import { useState } from "react"
import Image from "next/image"

export default function UserPage() {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const [handleImageSubmit] = useImageUpload()
    const [logout, e_1, isLoggedOut] = useHttpMutation(() => router.push("/sign-in"))

    const { data: results } = useHttpQuery<IQuizResult[]>("/api/quiz-results")
    const { data, loading, refetch } = useHttpQuery<IUser>("/api/auth")
    const { id, name, surname, image } = data ?? {}

    const imageUrl = image ? `/uploads/${image}` : defaultAvatar
    const totalScore = results?.reduce((sum, result) => sum + (result.score ?? 0), 0)

    const handleImageSelect = (image: File) => {
        setSelectedImage(image)
    }

    const handleLogOut = async () => {
        try {
            await logout("/api/logout", METHODS.POST)
        } catch (err) {
            console.error(`Logout failed:${err}`)
        }
    }

    const handleSubmitProfile = async () => {
        if (selectedImage) {
            await handleImageSubmit(selectedImage, id)
            setIsModalOpen(false)
            refetch()
        }
    }

    return (
        <Layout>
            <section className="min-h-screen flex items-start pt-40 justify-center bg-gray-900 text-gray-200">
                <Loader isLoading={loading || isLoggedOut} />
                <div className="bg-gray-800 p-7 rounded-lg shadow-lg w-full max-w-xl border border-gray-600">
                    <div className="flex items-center gap-8">
                        <Image
                            src={imageUrl}
                            onClick={() => setIsModalOpen(true)}
                            alt="User Avatar"
                            className="size-30 rounded-full border-4 hover:scale-105 transition-all cursor-pointer bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
                            width={150}
                            height={150}
                            priority
                        />
                        {!data ? (
                            <div className="bg-gradient-to-r from-red-500 to-red-800 tracking-wide text-gray-200 p-4 rounded-lg text-center font-semibold shadow-lg text-xl w-full">
                                Data isn&apos;t available yet 🚨
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <h2 className="text-4xl font-bold text-amber-50 text-center tracking-wide">
                                    {name} {surname}
                                </h2>
                                {results && (
                                    <div className="text-lg font-semibold bg-gradient-to-tr from-[#f93b15] via-[#f09819] to-[#f93b15] text-transparent bg-clip-text">
                                        Total score: <span className="text-white">{totalScore}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <Actions />
                    {data && (
                        <Logout
                            data={data}
                            loading={loading}
                            onLogout={handleLogOut}
                        />
                    )}
                </div>
            </section>
            <ImagePicker
                image={image!}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
                defaultAvatar={defaultAvatar}
                onImageSelect={handleImageSelect}
                handleSubmit={handleSubmitProfile}
            />
        </Layout>
    )
}
