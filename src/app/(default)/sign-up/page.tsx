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

export default function SignUpForm() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>()

    const onSuccess = () => {
        router.push("/sign-in")
        reset()
    }

    const [signUp, error, loading] = useHttpMutation<null, IUser>(onSuccess)

    const handleSignUp: SubmitHandler<IUser> = async (data) => {
        await signUp("/sign-up/api", METHODS.POST, data)
    }

    return (
        <section className={`${error ? "pt-10" : "pt-20"} min-h-screen flex items-start justify-center bg-gray-900`}>
            {loading && <Loader isLoading={loading} />}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-600">
                <div className="text-center pb-4">
                    <p className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">
                        Create new account
                    </p>
                    <p className="font-semibold text-gray-200 tracking-wide">It&apos;s quick and easy</p>
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
                <Link href="/sign-in" className="font-semibold text-gray-200 flex mt-5 justify-center text-center tracking-wider">
                    Already have an account?
                </Link>
            </div>
        </section>
    )
}
