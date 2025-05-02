import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("_token")?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  try {
    if (token) {
      const res = await fetch(new URL("/api/auth", req.url), {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: `_token=${token}`,
        },
      })
      const data = await res.json()
      const isAdmin = data.role === "admin"
      const isUser = data.role === "user"

      if (isUser && !pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/user", req.url))
      }

      if (isAdmin && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }

      return NextResponse.next()
    }
  } catch (err) {
    const errRes = err as Error

    if (errRes.message === "Invalid token") {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
