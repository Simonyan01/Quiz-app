import { UserModel } from "@/_helpers/model/user"

export default async function UsersPage() {
    const users = await UserModel.findAll({
        attributes: { exclude: ["password"] },
    })

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold text-indigo-400 mb-8">Users List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {users.map(({ id, login, role }) => (
                    <div
                        key={id}
                        className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 w-max text-center"
                    >
                        <h2 className="text-2xl font-semibold text-indigo-300">{login}</h2>
                        <p className={`mt-2 text-lg font-medium ${role === "admin" ? "text-red-400" : "text-green-400"}`}>
                            {role.toUpperCase()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
