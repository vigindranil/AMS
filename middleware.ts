import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/assets"]
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Get the token from the session
  const token = request.cookies.get("auth_token")?.value

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing login with token
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/assets/:path*", "/login"],
}

