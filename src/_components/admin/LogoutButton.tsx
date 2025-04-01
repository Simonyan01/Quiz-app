interface LogoutProps {
    data: any
    loading: boolean
    onLogout: () => void
}

export const Logout = ({ data, loading, onLogout }: LogoutProps) => {
    return (
        <button
            type="button"
            onClick={onLogout}
            className="w-full p-2 text-gray-200 font-semibold btn-grad cursor-pointer mt-6 rounded-lg text-2xl tracking-wider"
        >
            {loading && !data ? "Logging out..." : "Logout"}
        </button>
    )
}
