import { UserModel } from "@/_helpers/model/user"
import { IUser } from "@/_helpers/lib/types"
import bcrypt from "bcrypt"

export const POST = async (req: Request) => {
  try {
    const { login, password, ...rest } = (await req.json()) as IUser

    const loginRegExp = /^[a-zA-Z0-9_.]{3,20}$/
    const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!login.trim() || !password.trim()) {
      return Response.json({ message: "Մուտքանունն ու գաղտնաբառը պարտադիր են" }, { status: 400 })
    }

    if (!loginRegExp.test(login)) {
      return Response.json(
        { message: "Մուտքանունը պետք է պարունակի միայն տառեր, թվեր, ստորակետ և կետ, և լինի 3-20 նիշ երկարությամբ" },
        { status: 400 },
      )
    }

    if (!pwdRegExp.test(password)) {
      return Response.json(
        { message: "Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ, ներառի մեծատառ, փոքրատառ, թիվ և հատուկ նշան" },
        { status: 400 },
      )
    }

    const found = await UserModel.findOne({
      where: { login },
      attributes: { exclude: ["password"] },
    })

    if (found) {
      return Response.json({ message: "Մուտքանունը արդեն օգտագործվում է" }, { status: 400 })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({ login, password: hashedPwd, ...rest })
    const { password: _, ...userWithoutPwd } = newUser.toJSON()

    return Response.json({ message: "User successfully created", user: userWithoutPwd }, { status: 201 })
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
