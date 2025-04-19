import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { NextRequest } from "next/server"

export const GET = async () => {
  try {
    const users = await UserModel.findAll()
    
    return Response.json(users)
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { name, surname, login, password, role } = await req.json()

    const newUser = await UserModel.create({
      name,
      surname,
      login,
      password,
      role,
    })

    return Response.json(newUser, { status: 201 })
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

// export const PUT = async (req: NextRequest) => {
//   try {
//     const { id, name, surname, login, password, role } = await req.json()
//     const user = await UserModel.findByPk(id)

//     if (!user) {
//       return Response.json({ message: "User not found" }, { status: 404 })
//     }

//     await user.update({
//       name,
//       surname,
//       login,
//       password,
//       role,
//     })

//     return Response.json(user)
//   } catch {
//     return Response.json({ message: "Server error" }, { status: 500 })
//   }
// }

// export const DELETE = async (req: NextRequest) => {
//   try {
//     const { id } = await req.json()
//     const user = await UserModel.findByPk(id)

//     if (!user) {
//       return Response.json({ message: "User not found" }, { status: 404 })
//     }

//     await user.destroy()

//     return Response.json({ message: "User deleted successfully" })
//   } catch {
//     return Response.json({ message: "Server error" }, { status: 500 })
//   }
// }
