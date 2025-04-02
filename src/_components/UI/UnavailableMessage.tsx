interface IMessageProps {
    message: string
    additionalMessage?: string
}

export const UnavailableMessage = ({ message, additionalMessage }: IMessageProps) => {
    return (
        <div className="flex flex-col items-center justify-center tracking-wide space-y-4 p-4 bg-gray-800 rounded-lg shadow-lg">
            <svg
                className="w-18 h-18 text-gray-400 animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M10 1a9 9 0 10 0 18 9 9 0 000-18zM7 7a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0zm-3 6a4 4 0 00-4 4 1 1 0 002 0 2 2 0 114 0 1 1 0 002 0 4 4 0 00-4-4z"
                    clipRule="evenodd"
                />
            </svg>

            <p className="text-gray-500 text-xl font-semibold">
                {message}
            </p>
            <p className="text-gray-500 text-sm">
                Looks like you're all caught up! Check back later.{additionalMessage} 🚀
            </p>
        </div>
    )
}
