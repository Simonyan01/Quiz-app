 import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { NextRequest, NextResponse } from "next/server"
import { promisify } from "util"
import crypto from "crypto"
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

    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 14)
    const ext = path.extname(file.name)
    const fileName = `${hash}${ext}`
    const filePath = path.join(uploadDir, fileName)

    await fs.promises.writeFile(filePath, buffer)

    const user = await UserModel.findByPk(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    user.image = fileName
    await user.save()

    return NextResponse.json({ message: "Image uploaded successfully", filePath: user.image }, { status: 200 })
  } catch {
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 })
  }
}
