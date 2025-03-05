"use client"

import { SubmitHandler, useForm } from "react-hook-form"
import ErrorMessage from "@/_components/ErrorMessage"
import InputField from "@/_components/InputField"
import { IUser } from "@/_helpers/lib/types"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import Loader from "@/_components/Loader"
import { useState } from "react"
import Link from "next/link"
import "../global.css"

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignIn: SubmitHandler<IUser> = async (data) => {
        setIsLoading(true)

        try {
            await axios.post("/login/api", data)
            !error && router.push("/user")
            setError("")
            reset()
        } catch (err) {
            const errRes = err as AxiosError
            const res = errRes.response?.data as { message: string }
            setError(res?.message)
            setTimeout(() => setError(""), 5000)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Loader isLoading={isLoading} />
            <div className="bg-gray-800 p-7 rounded-2xl shadow-lg w-96 border border-gray-600">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center tracking-wider">Մուտք</h2>
                <form onSubmit={handleSubmit(handleSignIn)}>
                    <ErrorMessage message={error} />
                    <InputField
                        label="Մուտքանուն"
                        placeholder="Մուտքագրեք ձեր մուտքանունը"
                        register={register("login")}
                        error={errors.login?.message}
                    />
                    <InputField
                        label="Գաղտնաբառ"
                        type="password"
                        placeholder="Մուտքագրեք գաղտնաբառը"
                        register={register("password")}
                        error={errors.password?.message}
                    />
                    <button
                        type="submit"
                        className="w-full text-white p-2 btn-grad mt-2 rounded-lg text-xl tracking-wider cursor-pointer"
                    >
                        {isLoading ? "Մի փոքր սպասեք" : "Մուտք գործել"}
                    </button>
                </form>
                <Link href="/signup" className="font-semibold text-gray-200 flex mt-5 justify-center text-center tracking-wider">
                    Դեռ չե՞ք գրանցվել
                </Link>
            </div>
        </div>
    )
}
