interface ErrorMessageProps {
    message: string | boolean | null
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return message ? (
        <p className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white text-sm tracking-wider font-semibold p-2 rounded-lg shadow-md mt-3 animate-bounce w-full max-w-xl text-justify break-words">
            ⚠ {message}
        </p>
    ) : null
}
