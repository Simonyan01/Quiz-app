interface ErrorMessageProps {
    message: string | boolean | null
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return message ? (
        <p className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white grid place-self-center text-sm tracking-wider font-semibold p-2 rounded-lg max-w-[18rem] animate-bounce">
            ⚠ {message}
        </p>
    ) : null
}
