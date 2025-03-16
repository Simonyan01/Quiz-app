export default async function HomePage() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold">
                Learn <span className="text-green-500">10x Faster!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-3 tracking-wide">
                Unlock Your Potential with Personalized Quizzes
            </p>
            <button type="button" className="mt-6 px-6 py-3 transition-all duration-300 cursor-pointer bg-green-600 tracking-wide hover:bg-green-700 text-gray-200 text-lg font-semibold hover:scale-105 rounded-lg shadow-md">
                Get Started Now!
            </button>
        </div>
    )
}
