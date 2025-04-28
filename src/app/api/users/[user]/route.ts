import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { NextRequest } from "next/server"

type Params = Promise<{ user: string }>

export const GET = async (_req: NextRequest, context: { params: Params }) => {
  const params = await context.params
  const { user } = params

  if (!user) {
    return Response.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const foundUser = await UserModel.findOne({
      where: {
        id: user,
      },
      attributes: {
        exclude: ["password"],
      },
    })

    if (!foundUser) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json(foundUser, { status: 200 })
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export const PATCH = async (req: NextRequest, context: { params: Params }) => {
  const params = await context.params
  const { user } = params

  if (!user) {
    return Response.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const body = await req.json()

    const [updatedCount] = await UserModel.update(body, {
      where: { id: user },
    })

    if (updatedCount === 0) {
      return Response.json({ error: "User not found or no changes made" }, { status: 404 })
    }

    const updatedUser = await UserModel.findOne({
      where: { id: user },
      attributes: { exclude: ["login", "password", "image"] },
    })

    return Response.json(updatedUser, { status: 200 })
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export const DELETE = async (_req: NextRequest, context: { params: Params }) => {
  const params = await context.params
  const { user } = params

  if (!user) {
    return Response.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const deletedCount = await UserModel.destroy({
      where: { id: user },
    })

    if (deletedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ message: "User deleted successfully" }, { status: 200 })
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
