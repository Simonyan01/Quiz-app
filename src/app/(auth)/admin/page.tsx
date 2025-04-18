"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import useImageUpload from "@/_helpers/hooks/useImageUpload"
import { AdminActions } from "@/_components/admin/Actions"
import { ImagePicker } from "@/_components/UI/ImagePicker"
import AddUserForm from "@/_components/admin/AddUserForm"
import { Logout } from "@/_components/admin/LogoutButton"
import { IUser, METHODS } from "@/_helpers/types/types"
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
    const [createUser] = useHttpMutation<any, IUser>()
    const [logout] = useHttpMutation(() => router.push("/sign-in"))

    const { data, loading, refetch } = useHttpQuery<IUser>("/api/auth")
    const { id, name, surname, image } = data ?? {}
    const imageUrl = image ? `/uploads/${image}` : defaultAvatar

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

    const handleSubmitProfile = () => {
        if (selectedImage) {
            handleImageSubmit(selectedImage, id)
            setIsModalOpen(false)
            setTimeout(refetch, 500)
        }
    }

    const handleUserFormSubmit = async (formData: IUser) => {
        try {
            await createUser("/api/users", METHODS.POST, formData)
            notify("success", "User created successfully!")
            setIsFormOpen(false)
        } catch (err) {
            notify("error", "Something went wrong. Please try again!");
            console.error(`Error adding user:${err}`)
        }
    }

    return (
        <Layout>
            <section className="min-h-screen flex items-center justify-center px-6 bg-gray-900 text-gray-200">
                {loading && <Loader isLoading={loading} />}
                <ToastContainer />
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl border border-gray-600">
                    <div className="flex items-center gap-12">
                        <Image
                            src={imageUrl}
                            onClick={() => setIsModalOpen(true)}
                            alt="Admin Avatar"
                            className="size-20 rounded-full border-4 hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
                            width={150}
                            height={150}
                            priority
                        />
                        {!data ? (
                            <div className="bg-gradient-to-r from-red-500 to-red-800 tracking-wide text-gray-200 p-3 rounded-lg text-center font-semibold shadow-lg text-xl">
                                Data isn&apos;t available yet 🚨
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-4xl font-bold text-amber-50">{name} {surname}</h2>
                            </div>
                        )}
                    </div>
                    <AdminActions onAddUser={() => setIsFormOpen(true)} />
                    <AddUserForm
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
                image={image}
                isOpen={isModalOpen}
                setOpen={setIsModalOpen}
                defaultAvatar={defaultAvatar}
                onImageSelect={handleImageSelect}
                handleSubmit={handleSubmitProfile}
            />
        </Layout>
    )
}
