import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test users table
    const users = await query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.DB_NAME],
    )

    // Test if we can query the users table
    const userCount = await query("SELECT COUNT(*) as count FROM users")

    return NextResponse.json({
      status: "success",
      message: "Database tables verified",
      tables: users,
      userCount: userCount[0],
    })
  } catch (error) {
    console.error("Table verification error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to verify database tables",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

