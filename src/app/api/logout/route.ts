import { cookies } from "next/headers"

export async function POST() {
  try {
    ;(await cookies()).delete("_token")
    return Response.json({ message: "Logged out successfully" })
  } catch {
    return Response.json({ message: "Logout failed" }, { status: 500 })
  }
}
