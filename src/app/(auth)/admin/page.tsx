"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IQuizResult, IUser, METHODS } from "@/_helpers/types/types"
import { useImageUpload } from "@/_helpers/hooks/useImageUpload"
import { AddUserForm } from "@/_components/admin/AddUserForm"
import { ImagePicker } from "@/_components/UI/ImagePicker"
import { Logout } from "@/_components/common/LogoutButton"
import { Actions } from "@/_components/admin/Actions"
import { Layout } from "@/_components/layout/Layout"
import { defaultAvatar } from "@/_helpers/constants"
import { Loader } from "@/_components/UI/Loader"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from 'react-toastify'
import { useRouter } from "next/navigation"
import "@/app/(default)/global.css"
import { useState } from "react"
import Image from "next/image"

export default function AdminDashboard() {
    const router = useRouter()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const [handleImageSubmit] = useImageUpload()
    const [logout, e_1, isLoggedOut] = useHttpMutation(() => router.push("/sign-in"))
    const [createUser, error, isValid] = useHttpMutation<any, IUser>(() => {
        notify("success", "User created successfully!")
        setIsFormOpen(false)
    })

    const { data: results } = useHttpQuery<IQuizResult[]>("/api/quiz-results")
    const { data, loading, refetch } = useHttpQuery<IUser>("/api/auth")
    const { id, name, surname, image, role } = data ?? {}

    const imageUrl = image ? `/uploads/${image}` : defaultAvatar
    const totalScore = results?.reduce((sum, result) => sum + (result.score ?? 0), 0)

    const handleImageSelect = (image: File) => {
        setSelectedImage(image)
    }

    const handleLogOut = async () => {
        try {
            await logout("/api/logout", METHODS.POST)
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    const handleSubmitProfile = async () => {
        if (selectedImage) {
            await handleImageSubmit(selectedImage, id)
            setIsModalOpen(false)
            refetch()
        }
    }

    const handleUserFormSubmit = async (formData: IUser) => {
        try {
            await createUser("/api/users", METHODS.POST, formData)
        } catch (err) {
            notify("error", "Something went wrong. Please try again!");
            console.error(`Error adding user:${err}`)
        }
    }

    return (
        <Layout>
            <section className={`min-h-screen flex items-start justify-center bg-gray-900 text-gray-200 ${role === "admin" ? "pt-40" : "pt-35"}`}>
                <Loader isLoading={loading || isValid || isLoggedOut} />
                <ToastContainer />
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl border border-gray-600">
                    <div className="flex items-center gap-10">
                        <Image
                            src={imageUrl}
                            onClick={() => setIsModalOpen(true)}
                            alt="Admin Avatar"
                            className="size-30 rounded-full border-4 hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
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
                    <Actions onAddUser={() => setIsFormOpen(true)} />
                    <AddUserForm
                        error={error}
                        isOpen={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                        onFormSubmit={handleUserFormSubmit}
                    />
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
