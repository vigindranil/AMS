import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const connection = await createConnection()
    const [rows] = await connection.execute("SELECT * FROM assets WHERE id = ?", [params.id])
    await connection.end()

    const assets = rows as any[]
    if (assets.length === 0) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json(assets[0])
  } catch (error) {
    console.error("Error fetching asset:", error)
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const connection = await createConnection()

    const query = `
      UPDATE assets 
      SET 
        asset_id = ?,
        asset_name = ?,
        scheme = ?,
        implementing_agency = ?,
        amount_spent = ?,
        development_type = ?,
        development_details = ?
      WHERE id = ?
    `

    await connection.execute(query, [
      data.asset_id,
      data.asset_name,
      data.scheme,
      data.implementing_agency,
      data.amount_spent,
      data.development_type,
      data.development_details,
      params.id,
    ])

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
  }
}

