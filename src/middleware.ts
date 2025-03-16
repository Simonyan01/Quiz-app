import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const verify = await fetch(new URL("/api/auth", req.url), {
      method: "GET",
      headers: {
        Cookie: `_token=${token}`,
      },
    }).then((res) => res.json())

    if (verify.role === "user" && !pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/user", req.url))
    }

    if (verify.role === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  } catch (err) {
    const errRes = err as Error

    if (errRes.name === "TokenExpiredError") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
