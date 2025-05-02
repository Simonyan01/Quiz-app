import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { IUser } from "@/_helpers/types/types"
import { NextRequest } from "next/server"
import bcrypt from "bcrypt"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.toLowerCase() || ""

    let users = await UserModel.findAll()

    if (!users || users.length === 0) {
      return Response.json({ message: "No users found" }, { status: 404 })
    }

    if (search) {
      users = users.filter((user: IUser) => {
        const combinedFields = (user.name + user.surname + user.role).toLowerCase()
        return combinedFields.includes(search)
      })

      if (users.length === 0) {
        return Response.json({ message: "No users found matching your search criteria" }, { status: 404 })
      }
    }

    return Response.json(users)
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { name, surname, login, password, role } = await req.json()

    if (!name || !surname || !login || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 })
    }

    const trimmedLogin = login.trim()
    const trimmedPwd = password.trim()
    const loginRegExp = /^[a-zA-Z0-9_.]{3,20}$/
    const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/

    if (!loginRegExp.test(trimmedLogin)) {
      return Response.json(
        { message: "Username must contain only letters, numbers, underscore, and dot, and be 3-20 characters long" },
        { status: 400 },
      )
    }

    if (!pwdRegExp.test(trimmedPwd)) {
      return Response.json(
        {
          message: `Password must be at least 8 characters long and include at least one uppercase letter,
                    one lowercase letter, one number, and one special character`,
        },
        { status: 400 },
      )
    }

    const existingUser = await UserModel.findOne({ where: { login: trimmedLogin } })
    if (existingUser) {
      return Response.json({ message: "Login already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(trimmedPwd, 10)
    const newUser = await UserModel.create({
      name,
      surname,
      login: trimmedLogin,
      password: hashedPassword,
      role,
    })

    return Response.json({ message: "User successfully created", user: newUser }, { status: 201 })
  } catch (err) {
    const errRes = err as Error
    return Response.json({ message: "Server error", error: errRes.message }, { status: 500 })
  }
}