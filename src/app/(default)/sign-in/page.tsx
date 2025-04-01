"use client"

import { ErrorMessage } from "@/_components/common/ErrorMessage"
import { InputField } from "@/_components/common/InputField"
import { useHttpMutation } from "@/_helpers/hooks/useHttp"
import { SubmitHandler, useForm } from "react-hook-form"
import { IUser, METHODS } from "@/_helpers/types/types"
import { Loader } from "@/_components/UI/Loader"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "../global.css"

export default function SignInForm() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>()

    const onSuccess = (data: any) => {
        const { role } = data.user

        role === "admin"
            ? router.push("/admin")
            : router.push("/user")

        reset()
    }

    const [signIn, error, loading] = useHttpMutation<null, IUser>(onSuccess)

    const handleSignIn: SubmitHandler<IUser> = (data) => {
        signIn("/sign-in/api", METHODS.POST, data)
    }

    return (
        <section className="min-h-screen flex items-start pt-36 justify-center bg-gray-900">
            <Loader isLoading={loading} />
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-600">
                <img
                    src="/light-bulb.png"
                    alt="Quiz Icon"
                    className="mx-auto pb-4 animate-pulse"
                    draggable={false}
                />
                <form onSubmit={handleSubmit(handleSignIn)}>
                    <ErrorMessage message={error} />
                    <InputField
                        label="Username"
                        placeholder="Enter your username"
                        register={register("login")}
                        error={errors.login?.message}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        register={register("password")}
                        error={errors.password?.message}
                    />
                    <button
                        type="submit"
                        className="w-full text-white p-2 btn-grad mt-2 rounded-lg text-xl tracking-wider cursor-pointer"
                    >
                        {loading ? "Please wait" : "Log In"}
                    </button>
                </form>
                <Link href="/sign-up" className="font-semibold text-gray-200 flex mt-5 justify-center text-center tracking-wider">
                    Don't have an account yet?
                </Link>
            </div>
        </section>
    )
}
