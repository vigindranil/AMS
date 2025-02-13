import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

// GET route for fetching assets with search and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const connection = await createConnection()

    // Build the query with search and filters
    let query = `
      SELECT 
        a.*,
        u.name as created_by_name
      FROM assets a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (search) {
      query += ` AND (
        a.asset_name LIKE ? OR 
        a.asset_id LIKE ? OR 
        a.scheme LIKE ? OR
        a.implementing_agency LIKE ?
      )`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (type && type !== "All") {
      query += ` AND a.development_type = ?`
      params.push(type)
    }

    // Get total count
    const [countResult]: any = await connection.execute(`SELECT COUNT(*) as total FROM (${query}) as t`, params)
    const total = countResult[0].total

    // Add sorting and pagination
    query += ` ORDER BY ${sort} ${order}`

    // Log the query and params for debugging
    console.log("Executing query:", query)
    console.log("Query parameters:", params)

    const [rows] = await connection.execute(query, params)
    await connection.end()

    // Log the response data for debugging
    console.log("Number of rows returned:", (rows as any[]).length)

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch assets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST route for creating new asset
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const connection = await createConnection()

    const query = `
      INSERT INTO assets (
        asset_id, asset_name, scheme, implementing_agency,
        latitude, longitude, work_order_number, completion_date,
        amount_spent, development_type, development_details,
        photo_url, inspection_location, nature_of_work,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await connection.execute(query, [
      data.assetId,
      data.assetName,
      data.scheme,
      data.implementingAgency,
      data.latitude,
      data.longitude,
      data.workOrderNumber,
      data.completionDate,
      data.amountSpent,
      data.developmentType,
      data.developmentDetails,
      data.photoUrl,
      data.inspectionLocation,
      data.natureOfWork,
      data.createdBy || 1, // Default to user ID 1 for now
    ])

    await connection.end()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}

