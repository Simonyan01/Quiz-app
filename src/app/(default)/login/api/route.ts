import { UserModel } from "@/_helpers/model/user"
import { IUser } from "@/_helpers/lib/types"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const POST = async (request: NextRequest) => {
  try {
    const { login, password } = (await request.json()) as IUser

    if (!login.trim() || !password.trim()) {
      return Response.json({ message: "Տվյալները բացակայում են!" }, { status: 400 })
    }

    const loginRegExp = /^[a-zA-Z0-9_.]{3,20}$/

    if (!loginRegExp.test(login)) {
      return Response.json({ message: "Մուտքանունը անվավեր է" }, { status: 400 })
    }

    const found = await UserModel.findOne({ where: { login } })
    const key = process.env.JWT_SECRET

    if (!found || !(await bcrypt.compare(password, found.password))) {
      return Response.json({ message: "Սխալ մուտքագրած տվյալներ!" }, { status: 400 })
    }

    if (!key) {
      console.error("Գաղտնի բանալին չի սահմանվել!")
      return Response.json({ message: "Սերվերի սխալ" }, { status: 500 })
    }

    const token = jwt.sign(
      {
        id: found.id,
        name: found.name,
        surname: found.surname,
        role: found.role,
      },
      key,
      { expiresIn: "7d" },
    )

    ;(await cookies()).set("_token", token, { secure: true, httpOnly: true })

    return Response.json({ message: "ok", found })
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
