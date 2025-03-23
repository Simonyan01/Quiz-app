import { NextRequest, NextResponse } from "next/server"
import { UserModel } from "@/_helpers/model/user"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public/uploads")

    try {
      await access(uploadDir)
    } catch {
      await mkdir(uploadDir, { recursive: true })
    }

    const fileName = `${userId}-${file.name}`
    const filePath = path.join(uploadDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())

    await fs.promises.writeFile(filePath, buffer)

    const user = await UserModel.findByPk(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    user.image = `/uploads/${fileName}`
    await user.save()

    return NextResponse.json({ message: "Image uploaded successfully", filePath: user.image }, { status: 200 })
  } catch {
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 })
  }
}
