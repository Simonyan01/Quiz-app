"use client"

import { useHttpMutation, useHttpQuery } from '@/_helpers/hooks/useHttp'
import { ErrorMessage } from '@/_components/common/ErrorMessage'
import { IUser, METHODS } from '@/_helpers/types/types'
import { Layout } from '@/_components/layout/Layout'
import { Loader } from '@/_components/UI/Loader'
import { notify } from '@/_helpers/hooks/notify'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface IFormData {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export default function Settings() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>()

    const { data } = useHttpQuery<IUser>("/api/auth")
    const { id } = data ?? {}

    const [changePwd, error, loading] = useHttpMutation<any, IFormData>(() => {
        notify('success', 'Password changed successfully')
        setTimeout(() => router.push("/user"), 3000);
        reset()
    })

    const onSubmit = (data: IFormData) => {
        try {
            const newData = { ...data, userId: id }
            changePwd("/api/settings", METHODS.POST, newData)
        } catch (err) {
            notify('error', 'Failed to change password')
        }
    }

    return (
        <Layout>
            <ToastContainer />
            <section className="flex justify-center items-center min-h-screen bg-gray-900">
                <Loader isLoading={loading} />
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-sm w-full tracking-wide border border-gray-700">
                    <h2 className="text-2xl font-semibold text-center text-gray-200 mb-5">Change Password</h2>
                    <ErrorMessage message={error} />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="old-password">Old Password</label>
                            <input
                                type="password"
                                id="old-password"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                {...register('oldPassword', { required: 'Old password is required' })}
                            />
                            {errors.oldPassword && <p className="text-orange-600 mt-2">{errors.oldPassword.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Your password must be at least 8 characters long.',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                        message: `Your password must include at least one uppercase letter, one lowercase letter, one number, 
                                                  and one special character for enhanced security.`,
                                    }
                                })}
                            />
                            {errors.newPassword && <p className="text-orange-600 mt-2">{errors.newPassword.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 cursor-pointer text-gray-200 px-3 py-2 tracking-wide rounded-lg text-2xl font-bold shadow-md hover:bg-gray-200 hover:text-indigo-600 transition-all duration-200"
                        >
                            Change
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}
