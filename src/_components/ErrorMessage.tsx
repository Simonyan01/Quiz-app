interface ErrorMessageProps {
    message?: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return message ? (
        <p className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white text-sm tracking-wider font-semibold px-4 py-2 rounded-md shadow-md m-2 animate-bounce ">
            ⚠ {message}
        </p>
    ) : null
}
