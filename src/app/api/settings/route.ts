import { UserModel } from "@/_helpers/model/entities/user"
import { NextRequest } from "next/server"
import bcrypt from "bcrypt"

export const POST = async (req: NextRequest) => {
  try {
    const { oldPassword, newLogin, newPassword, userId } = await req.json()

    if (!oldPassword.trim()) {
      return Response.json({ message: "Old password is required" }, { status: 400 })
    }

    if (!newPassword?.trim() && !newLogin?.trim()) {
      return Response.json({ message: "New password is required" }, { status: 400 })
    }

    const user = await UserModel.findOne({ where: { id: userId } })

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const isOldPwdValid = await bcrypt.compare(oldPassword, user.password)

    if (!isOldPwdValid) {
      return Response.json({ message: "Old password is incorrect" }, { status: 400 })
    }

    if (newPassword) {
      const pwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
      const isSamePwd = await bcrypt.compare(newPassword, user.password)

      if (isSamePwd) {
        return Response.json({ message: "You can't reuse your old password as the new password." }, { status: 400 })
      }

      if (!pwdRegExp.test(newPassword)) {
        return Response.json(
          {
            message: `Your password must be at least 8 characters long and include at least one uppercase letter, 
                     one lowercase letter, one number, and one special symbol`,
          },
          { status: 400 },
        )
      }

      const hashedNewPwd = await bcrypt.hash(newPassword, 10)
      await UserModel.update({ password: hashedNewPwd }, { where: { id: userId } })
    }

    if (newLogin) {
      const existingUser = await UserModel.findOne({ where: { login: newLogin } })

      if (existingUser) {
        return Response.json({ message: "Login is already taken" }, { status: 400 })
      }

      await UserModel.update({ login: newLogin }, { where: { id: userId } })
    }

    const userWithoutPwd = user.toJSON()
    delete userWithoutPwd.password

    return Response.json({ message: "Changes saved successfully", user: userWithoutPwd }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
