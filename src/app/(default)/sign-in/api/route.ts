import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { IUser } from "@/_helpers/types/types"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const POST = async (req: NextRequest) => {
  try {
    const { login, password } = (await req.json()) as IUser

    if (!login.trim() || !password!.trim()) {
      return Response.json({ message: "Missing credentials!" }, { status: 400 })
    }

    const user = await UserModel.findOne({ where: { login } })
    const key = process.env.JWT_SECRET

    if (!user || !(await bcrypt.compare(password!, user.password))) {
      return Response.json({ message: "Incorrect login details!" }, { status: 400 })
    }

    if (!key) {
      console.error("Secret key isn't set!")
      return Response.json({ message: "Server error" }, { status: 500 })
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
      key,
      { expiresIn: "2d" },
    )

    const cookieStore = await cookies()
    cookieStore.set("_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 2,
    })

    const userWithoutPwd = user.toJSON()
    delete userWithoutPwd.password

    return Response.json({ message: "OK", user: userWithoutPwd })
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
