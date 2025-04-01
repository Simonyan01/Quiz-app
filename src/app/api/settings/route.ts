import { UserModel } from "@/_helpers/model/entities/user"
import { NextRequest } from "next/server"
import bcrypt from "bcrypt"

export const POST = async (req: NextRequest) => {
  try {
    const { oldPassword, newPassword, userId } = await req.json()

    const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!oldPassword.trim() || !newPassword.trim()) {
      return Response.json({ message: "All fields are required" }, { status: 400 })
    }

    if (!pwdRegExp.test(newPassword)) {
      return Response.json(
        {
          message: `Your password must be at least 8 characters long and include at least one uppercase letter, 
                    one lowercase letter, one number, and one special character for enhanced security.`,
        },
        { status: 400 },
      )
    }

    const user = await UserModel.findOne({ where: { id: userId } })

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const isOldPwdValid = await bcrypt.compare(oldPassword, user.password)

    if (!isOldPwdValid) {
      return Response.json({ message: "Old password is incorrect" }, { status: 400 })
    }

    const hashedNewPwd = await bcrypt.hash(newPassword, 10)

    await UserModel.update({ password: hashedNewPwd }, { where: { id: userId } })

    return Response.json({ message: "Password changed successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
