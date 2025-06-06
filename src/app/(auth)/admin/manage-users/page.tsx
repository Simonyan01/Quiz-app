"use client"

import { DeleteConfirmModal } from "@/_components/common/DeleteConfirmModal"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { EditUserForm } from "@/_components/admin/EditUserForm"
import { UsersList } from "@/_components/user/UsersList"
import { FaRegSadCry, FaSpinner } from "react-icons/fa"
import { IUser, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { useEffect, useRef, useState } from "react"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import "@/app/(default)/global.css"

export default function ManageUsers() {
    const router = useRouter()
    const contentRef = useRef<HTMLElement>(null)
    const [openModal, setOpenModal] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

    const { data: users, loading, refetch } = useHttpQuery<IUser[]>("/api/users")
    const [deleteUser, isDeleting] = useHttpMutation<any, any>(refetch)
    const [updateUser, updateError, isUpdating] = useHttpMutation<any, IUser>(() => {
        notify("success", "User updated successfully!")
        refetch()
    })

    const handleEdit = (userId: number) => {
        const userToEdit = users?.find(user => user.id === userId)
        if (userToEdit) {
            setSelectedUser(userToEdit)
            setIsEditFormOpen(true)
        }
    }

    const handleCloseForm = () => {
        setIsEditFormOpen(false)
        setSelectedUser(null)
    }

    const handleDeleteClick = (userId: number) => {
        setSelectedUserId(userId)
        setOpenModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (selectedUserId !== null) {
            try {
                await deleteUser(`/api/users/${selectedUserId}`, METHODS.DELETE)
                notify("success", "User deleted successfully!")
            } catch (err) {
                notify("error", "Failed to delete user")
                console.error(`Error deleting user: ${err}`)
            } finally {
                setOpenModal(false)
                setSelectedUserId(null)
            }
        }
    }

    const handleEditFormSubmit = async (formData: IUser) => {
        try {
            if (selectedUser) {
                setIsEditFormOpen(false)
                await updateUser(`/api/users/${selectedUser.id}`, METHODS.PATCH, formData)
            }
        } catch (err) {
            notify("error", "Something went wrong while updating the user!")
            console.error(`Error updating user: ${err}`)
        }
    }

    useEffect(() => {
        const content = contentRef.current
        if (content) {
            if (openModal) {
                content.setAttribute("inert", "true")
            } else {
                content.removeAttribute("inert")
            }
        }
    }, [openModal])
    return (
        <Layout>
            <ToastContainer />
            <section ref={contentRef} className="container min-h-screen min-w-full mx-auto p-6 bg-gray-900">
                <h1 className="text-[40px] font-bold bg-gradient-to-br from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent text-center mt-4">Manage Users</h1>
                <div className="tracking-wide">
                    {loading || isUpdating || isDeleting ? (
                        <div className="flex justify-center items-center mt-30">
                            <FaSpinner className="animate-spin text-white text-4xl" />
                        </div>
                    ) : users?.length === 0 ? (
                        <div className="flex flex-col w-9/12 mx-auto justify-center items-center text-gray-300 mt-15 p-6 bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-900 rounded-xl shadow-xl">
                            <FaRegSadCry className="text-6xl mb-6 text-indigo-200" />
                            <p className="text-2xl text-center font-semibold text-gray-100">No users found.</p>
                            <p className="text-lg text-gray-400 mt-2">Looks like there are no users available at the moment. You can add new users to get started.</p>
                            <button
                                type="button"
                                onClick={() => router.push("/admin")}
                                className="mt-6 bg-indigo-500 text-white cursor-pointer py-2 px-6 font-semibold rounded-lg hover:bg-white hover:text-indigo-500 transition-all duration-200 transform hover:scale-105"
                            >
                                Add New User
                            </button>
                        </div>
                    ) : (
                        <UsersList
                            users={users}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </div>
            </section>
            {selectedUser && (
                <EditUserForm
                    error={updateError}
                    isOpen={isEditFormOpen}
                    userData={selectedUser}
                    onClose={handleCloseForm}
                    onFormSubmit={handleEditFormSubmit}
                />
            )}
            <DeleteConfirmModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm User Deletion"
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
            <ScrollButton />
        </Layout>
    )
}
