import { ErrorMessage } from "../common/ErrorMessage"
import { IUser } from "@/_helpers/types/types"
import { useForm } from "react-hook-form"

interface FormProps {
    isOpen: boolean
    onClose: () => void
    error: string | boolean
    onFormSubmit: (formData: IUser) => void
}

interface Field {
    name: keyof IUser
    type?: "text" | "password" | "select"
    label?: string
    placeholder?: string
    options?: string[]
}

export const AddUserForm = ({ error, isOpen, onClose, onFormSubmit }: FormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<IUser>()

    const fields: Field[] = [
        { name: "name", type: "text", placeholder: "Name" },
        { name: "surname", type: "text", placeholder: "Surname" },
        { name: "login", type: "text", placeholder: "Login" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "role", type: "select", options: ["user", "admin"] },
    ]

    return (
        <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
            <div className={`modal-content ${isOpen ? "open" : ""} shadow-xl border border-gray-700 bg-gray-800 text-white rounded-lg`}>
                <h2 className={`text-2xl font-semibold mb-4 ${error && "mb-7"} text-center`}>Add New User</h2>
                <ErrorMessage message={error} />
                <form onSubmit={handleSubmit(onFormSubmit)} className={`space-y-5 ${error && "mt-2"}`}>
                    {fields.map(({ name, type = "text", placeholder, options }) => (
                        <div key={name}>
                            {type === "select" ? (
                                <select
                                    id={name}
                                    {...register(name, { required: `${placeholder} is required` })}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    {options?.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id={name}
                                    type={type}
                                    placeholder={placeholder}
                                    {...register(name, { required: `${placeholder} is required` })}
                                    className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            )}
                            {errors[name] && <p className="text-red-400 mt-2">{errors[name]?.message}</p>}
                        </div>
                    ))}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 text-white cursor-pointer font-semibold rounded-md hover:bg-green-700 transition duration-200"
                        >
                            Add User
                        </button>
                    </div>
                </form>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full py-2 bg-gray-500 text-white rounded-md transition-all cursor-pointer hover:bg-gray-600">
                    Close
                </button>
            </div>
        </div>
    )
}
