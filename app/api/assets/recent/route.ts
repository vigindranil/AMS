import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const connection = await createConnection()
    
    const query = `
      SELECT 
        asset_id,
        asset_name,
        development_type,
        amount_spent,
        created_at
      FROM assets 
      ORDER BY created_at DESC 
      LIMIT 5
    `
    
    const [rows] = await connection.execute(query)
    await connection.end()
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching recent assets:', error)
    return NextResponse.json(
      { error: "Failed to fetch recent assets" },
      { status: 500 }
    )
  }
}
