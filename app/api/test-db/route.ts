import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test basic connection
    const connection = await createConnection()
    console.log("Database connection established")

    // Test simple query
    const [connectionTest] = await connection.execute("SELECT 1 + 1 as sum")
    console.log("Basic query test:", connectionTest)

    // Test users table
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
    console.log("Users table test:", users)

    // Test specific user
    const [adminUser] = await connection.execute("SELECT id, email, name, role FROM users WHERE email = ?", [
      "admin@example.com",
    ])
    console.log("Admin user test:", adminUser)

    await connection.end()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      tests: {
        connection: true,
        basicQuery: connectionTest,
        usersTable: users,
        adminUser: adminUser,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

