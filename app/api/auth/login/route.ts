import { createConnection } from "@/lib/db"
import { compare } from "bcrypt"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("Login attempt for email:", email)

    const connection = await createConnection()

    // Get user from database
    const [rows]: any = await connection.execute("SELECT * FROM users WHERE email = ?", [email])
    console.log("Found users:", rows?.length || 0)

    await connection.end()

    if (!rows || rows.length === 0) {
      console.log("No user found with email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = rows[0]
    console.log("User found:", { id: user.id, email: user.email, role: user.role })

    const passwordMatch = await compare(password, user.password)
    console.log("Password match:", passwordMatch)

    if (!passwordMatch) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set cookie
    cookies().set("auth_token", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    console.log("Login successful for user:", email)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

