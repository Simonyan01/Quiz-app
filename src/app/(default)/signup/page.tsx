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

export default function SignUpForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignup: SubmitHandler<IUser> = async (data) => {
        setIsLoading(true)

        try {
            await axios.post("/signup/api", data)
            !error && router.push("/login")
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
                <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center tracking-wider">Գրանցում</h2>
                <form onSubmit={handleSubmit(handleSignup)}>
                    <ErrorMessage message={error} />
                    <InputField
                        label="Անուն"
                        placeholder="Մուտքագրեք ձեր անունը"
                        register={register("name", { required: "Խնդրում ենք լրացնել ձեր անունը" })}
                        error={errors.name?.message}
                    />
                    <InputField
                        label="Ազգանուն"
                        placeholder="Մուտքագրեք ձեր ազգանունը"
                        register={register("surname", { required: "Խնդրում ենք լրացնել ձեր ազգանունը" })}
                        error={errors.surname?.message}
                    />
                    <InputField
                        label="Մուտքանուն"
                        placeholder="Մուտքագրեք ձեր մուտքանունը"
                        register={register("login")}
                    />
                    <InputField
                        label="Գաղտնաբառ"
                        type="password"
                        placeholder="Մուտքագրեք գաղտնաբառը"
                        register={register("password")}
                    />
                    <button
                        type="submit"
                        className="w-full btn-grad tracking-wider cursor-pointer mt-2 text-white p-2 rounded-lg  text-xl"
                    >
                        {isLoading ? "Մի փոքր սպասեք" : "Գրանցվել"}
                    </button>
                </form>
                <Link href="/login" className="font-semibold text-gray-200 flex mt-5 justify-center text-center tracking-wider">
                    Արդեն գրանցվա՞ծ եք
                </Link>
            </div>
        </div>
    )
}
