import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"
import type { RowDataPacket } from "mysql2"

interface AssetRow extends RowDataPacket {
  id: number
  asset_id: string
  asset_name: string
  // ... other fields
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
    const limit = Math.max(1, Number.parseInt(searchParams.get("limit") || "10"))
    const offset = (page - 1) * limit

    // Get all search parameters
    const filters = {
      assetId: searchParams.get("assetId"),
      assetName: searchParams.get("assetName"),
      scheme: searchParams.get("scheme"),
      agency: searchParams.get("agency"),
      type: searchParams.get("type"),
      minAmount: searchParams.get("minAmount"),
      maxAmount: searchParams.get("maxAmount"),
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      natureOfWork: searchParams.get("natureOfWork"),
    }

    const connection = await createConnection()

    // Build the query dynamically based on filters
    const conditions: string[] = ["1=1"]
    const params: any[] = []

    // Only add conditions for non-empty values
    if (filters.assetId && filters.assetId.trim()) {
      conditions.push("a.asset_id LIKE ?")
      params.push(`%${filters.assetId}%`)
    }

    if (filters.assetName && filters.assetName.trim()) {
      conditions.push("a.asset_name LIKE ?")
      params.push(`%${filters.assetName}%`)
    }

    if (filters.scheme && filters.scheme.trim()) {
      conditions.push("a.scheme LIKE ?")
      params.push(`%${filters.scheme}%`)
    }

    if (filters.agency && filters.agency.trim()) {
      conditions.push("a.implementing_agency LIKE ?")
      params.push(`%${filters.agency}%`)
    }

    // Only add type condition if it's not "All"
    if (filters.type && filters.type !== "All") {
      conditions.push("a.development_type = ?")
      params.push(filters.type)
    }

    if (filters.minAmount && !isNaN(Number.parseFloat(filters.minAmount))) {
      conditions.push("a.amount_spent >= ?")
      params.push(Number.parseFloat(filters.minAmount))
    }

    if (filters.maxAmount && !isNaN(Number.parseFloat(filters.maxAmount))) {
      conditions.push("a.amount_spent <= ?")
      params.push(Number.parseFloat(filters.maxAmount))
    }

    if (filters.dateFrom && filters.dateFrom.trim()) {
      conditions.push("DATE(a.created_at) >= ?")
      params.push(filters.dateFrom)
    }

    if (filters.dateTo && filters.dateTo.trim()) {
      conditions.push("DATE(a.created_at) <= ?")
      params.push(filters.dateTo)
    }

    if (filters.natureOfWork && filters.natureOfWork.trim()) {
      conditions.push("a.nature_of_work LIKE ?")
      params.push(`%${filters.natureOfWork}%`)
    }

    // Construct the base query
    const baseQuery = `
      SELECT 
        a.*,
        u.name as created_by_name
      FROM assets a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE ${conditions.join(" AND ")}
    `

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as t`
    const [countRows] = await connection.query<RowDataPacket[]>(countQuery, params)
    const total = countRows[0].total

    // Add sorting and pagination to the base query
    const finalQuery = `
      ${baseQuery}
      ORDER BY a.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    console.log("Executing query:", finalQuery.replace(/\s+/g, " "))
    console.log("With parameters:", params)

    const [rows] = await connection.query<AssetRow[]>(finalQuery, params)
    await connection.end()

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
    console.error("Error searching assets:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to search assets",
          details: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Failed to search assets" }, { status: 500 })
  }
}

