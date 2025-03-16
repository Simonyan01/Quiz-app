interface InputFieldProps {
    label: string
    type?: string
    placeholder: string
    register: any
    error?: string
}

export default function InputField({ label, type = "text", placeholder, register, error }: InputFieldProps) {
    return (
        <div className="mb-4">
            <label className="inline-block tracking-wider text-gray-200 mb-1">{label}</label>
            <input
                type={type}
                {...register}
                className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                placeholder={placeholder}
            />
            {error && <p className="text-red-400 pt-1">{error}</p>}
        </div>
    )
}
