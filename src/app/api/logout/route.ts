import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete("_token")
    cookieStore.delete("_refresh")
    return Response.json({ message: "Logged out successfully" })
  } catch {
    return Response.json({ message: "Logout failed" }, { status: 500 })
  }
}
