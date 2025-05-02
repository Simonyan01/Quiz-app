import "@/_helpers/config/associations"
import { UserModel } from "@/_helpers/model/entities/user"

type Params = Promise<{ token: string }>

export const GET = async (_req: Request, context: { params: Params }) => {
  const { token } = await context.params

  const user = await UserModel.findOne({ where: { activationToken: token } })
  if (!user) {
    return Response.json({ message: "Invalid or expired activation token" }, { status: 400 })
  }

  user.verified = true
  user.activationToken = null
  await user.save()

  return Response.json({ message: "Account successfully activated" }, { status: 200 })
}
