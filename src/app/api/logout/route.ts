import { cookies } from "next/headers"

export async function GET() {
  try {
    ;(await cookies()).set("_token", "", { expires: new Date(0) })
    return Response.json({ message: "Logged out successfully" })
  } catch {
    return Response.json({ message: "Logout failed" }, { status: 500 })
  }
}
