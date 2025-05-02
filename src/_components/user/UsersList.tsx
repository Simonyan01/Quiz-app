import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { IUser } from "@/_helpers/types/types"

interface IProps {
    users: IUser[]
    onEdit: (userId: number) => void
    onDelete: (userId: number) => void
}

export function UsersList({ users, onEdit, onDelete }: IProps) {
    const headers = ["Name", "Surname", "Email", "Role", "Actions"]

    return (
        <table className="min-w-8/12 rounded-lg mx-auto bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-900 border-gray-600 mt-15">
            <thead className="text-gray-100">
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className="py-3 px-6 text-left">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr
                        key={user.id}
                        className="border-t border-gray-600 hover:bg-indigo-900 transition-all duration-300"
                    >
                        <td className="py-3 px-6 text-gray-200">{user.name}</td>
                        <td className="py-3 px-6 text-gray-200">{user.surname}</td>
                        <td className="py-3 px-6 text-gray-200">{user.email}</td>
                        <td className={`py-3 px-6 font-semibold ${user.role === "admin" ? "text-red-400" : "text-blue-400"}`}>
                            {user.role}
                        </td>
                        <td className="py-3 px-6 flex gap-4 items-center justify-start">
                            <button
                                type="button"
                                title="Edit User"
                                onClick={() => onEdit(user.id)}
                                className="text-yellow-400 hover:text-yellow-500 cursor-pointer transition-all duration-200 hover:scale-110"
                            >
                                <FaEdit size={22} />
                            </button>
                            <button
                                type="button"
                                title="Delete User"
                                onClick={() => onDelete(user.id)}
                                className="text-red-400 hover:text-red-500 cursor-pointer transition-all duration-200 hover:scale-110"
                            >
                                <FaTrashAlt size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
