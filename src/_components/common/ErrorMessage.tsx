import "@/app/global.css"

interface ErrorMessageProps {
    message: string | boolean | null
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return message ? (
        <p className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white text-sm tracking-wider font-semibold p-2 rounded-lg w-full animate-customBounce max-w-xl text-balance">
            ⚠ {message}
        </p>
    ) : null
}
