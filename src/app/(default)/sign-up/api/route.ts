import "@/_helpers/config/associations"

import { sendActivationEmail } from "@/_helpers/lib/activationEmail"
import { UserModel } from "@/_helpers/model/entities/user"
import { activationToken } from "@/_helpers/constants"
import bcrypt from "bcrypt"

export const POST = async (req: Request) => {
  try {
    const { name, surname, login, email, password } = await req.json()

    const loginRegExp = /^[a-zA-Z0-9_.]{3,20}$/
    const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!login.trim()) {
      return Response.json({ message: "Username is required" }, { status: 400 })
    }

    if (!loginRegExp.test(login)) {
      return Response.json(
        { message: "Username must contain only letters, numbers, underscore, and dot, and be 3-20 characters long" },
        { status: 400 },
      )
    }

    if (!password!.trim()) {
      return Response.json({ message: "Password is required" }, { status: 400 })
    }

    if (!pwdRegExp.test(password!)) {
      return Response.json(
        {
          message: `Your password must be at least 8 characters long and include at least one uppercase letter, 
                    one lowercase letter, one number, and one special character for enhanced security.`,
        },
        { status: 400 },
      )
    }

    const existingLogin = await UserModel.findOne({ where: { login } })
    if (existingLogin) {
      return Response.json({ message: "Username is already in use" }, { status: 400 })
    }

    const existingEmail = await UserModel.findOne({ where: { email } })
    if (existingEmail) {
      return Response.json({ message: "Email is already in use" }, { status: 400 })
    }

    const hashedPwd = await bcrypt.hash(password!, 10)
    const newUser = await UserModel.create({ name, surname, login, email, password: hashedPwd, activationToken })

    await sendActivationEmail(email, name, surname)

    return Response.json({ message: "User successfully created", user: newUser }, { status: 201 })
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
