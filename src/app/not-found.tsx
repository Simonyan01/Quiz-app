import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-center dark:bg-gray-800 tracking-wider dark:text-gray-200">
            <h1 className="text-9xl font-bold animate-pulse">404</h1>
            <p className="text-lg">Oops! The page you're looking for doesn't exist.</p>
            <Link href="/admin" passHref>
                <button
                    type="button"
                    className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer text-lg hover:bg-blue-700"
                >
                    Go Home
                </button>
            </Link>
        </div>
    )
}

