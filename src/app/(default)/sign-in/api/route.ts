import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { generateTokens } from "@/_helpers/utils/jwt"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json()

    if (!email.trim() || !password?.trim()) {
      return Response.json({ message: "Missing credentials!" }, { status: 400 })
    }

    const user = await UserModel.findOne({ where: { email } })
    const match = await bcrypt.compare(password, user!.password)

    if (!user || !match) {
      return Response.json({ message: "Incorrect auth credentials!" }, { status: 400 })
    }

    if (!user.verified) {
      return Response.json({ message: "Please verify your email before proceeding!" }, { status: 403 })
    }

    const payload = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    }

    const { accessToken, refreshToken } = generateTokens(payload)

    const cookieStore = await cookies()
    cookieStore.set("_token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    })

    cookieStore.set("_refresh", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })

    const userWithoutPwd = user.toJSON()
    delete userWithoutPwd.password

    return Response.json({ message: "OK", user: userWithoutPwd })
  } catch (err) {
    console.error(err)
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
