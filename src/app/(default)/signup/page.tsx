"use client"

import { useHttpMutation } from "@/_helpers/hooks/useHttp"
import { SubmitHandler, useForm } from "react-hook-form"
import { IUser, METHODS } from "@/_helpers/lib/types"
import ErrorMessage from "@/_components/ErrorMessage"
import InputField from "@/_components/InputField"
import { useRouter } from "next/navigation"
import Loader from "@/_components/Loader"
import Link from "next/link"
import "../global.css"

export default function SignUpForm() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>()

    const onSuccess = () => {
        router.push("/login")
        reset()
    }

    const [signUp, loading, error] = useHttpMutation<null, IUser>(onSuccess)

    const handleSignUp: SubmitHandler<IUser> = (data) => {
        signUp("/signup/api", METHODS.POST, data)
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-900">
            <Loader isLoading={loading} />
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-600">
                <div className="text-center tracking-wide pb-4">
                    <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">
                        Create a new account
                    </p>
                    <p className="font-semibold text-gray-200">It's quick and easy.</p>
                </div>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <ErrorMessage message={error} />
                    <InputField
                        label="First name"
                        placeholder="Enter your first name"
                        register={register("name", { required: "Please enter your first name" })}
                        error={errors.name?.message}
                    />
                    <InputField
                        label="Last name"
                        placeholder="Enter your last name"
                        register={register("surname", { required: "Please enter your last name" })}
                        error={errors.surname?.message}
                    />
                    <InputField
                        label="Username"
                        placeholder="Enter your username"
                        register={register("login")}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        register={register("password")}
                    />
                    <button
                        type="submit"
                        className="w-full btn-grad tracking-wider cursor-pointer mt-2 text-white p-2 rounded-lg text-xl"
                    >
                        {loading ? "Please wait" : "Sign Up"}
                    </button>
                </form>
                <Link href="/login" className="font-semibold text-gray-200 flex mt-5 justify-center text-center tracking-wider">
                    Already have an account?
                </Link>
            </div>
        </section>
    )
}
