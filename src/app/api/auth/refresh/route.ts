import { verifyRefreshToken, generateTokens } from "@/_helpers/utils/jwt"
import { cookies } from "next/headers"
import { serialize } from "cookie"

export const POST = async () => {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("_refresh")?.value

    if (!refreshToken) {
      return Response.json({ message: "Unauthorized: No refresh token" }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken) as {
      id: number
      name: string
      surname: string
      role: string
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload)

    const accessCookie = serialize("_token", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    const refreshCookie = serialize("_refresh", newRefreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    const headers = new Headers()
    headers.append("Set-Cookie", accessCookie)
    headers.append("Set-Cookie", refreshCookie)
    headers.append("Content-Type", "application/json")

    return new Response(JSON.stringify({ message: "Token refreshed" }), {
      status: 200,
      headers,
    })
  } catch (err) {
    const errRes = err as Error
    return Response.json({ message: "Invalid refresh token", error: errRes.message }, { status: 401 })
  }
}
