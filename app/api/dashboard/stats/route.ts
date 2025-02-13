import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const connection = await createConnection()

    // Get total assets count
    const [totalRows] = (await connection.execute("SELECT COUNT(*) as total FROM assets")) as any[]

    // Get this month's assets
    const [monthlyRows] = (await connection.execute(
      "SELECT COUNT(*) as total FROM assets WHERE MONTH(created_at) = MONTH(CURRENT_DATE())",
    )) as any[]

    // Get pending inspection (assets created in last 30 days)
    const [pendingRows] = (await connection.execute(
      "SELECT COUNT(*) as total FROM assets WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
    )) as any[]

    // Get total amount spent
    const [amountRows] = (await connection.execute("SELECT SUM(amount_spent) as total FROM assets")) as any[]

    // Get completion date wise amount spent data
    const [completionData] = (await connection.execute(`
      SELECT 
        DATE(completion_date) as completion_date,
        SUM(amount_spent) as amount_spent
      FROM assets 
      WHERE completion_date IS NOT NULL
      GROUP BY DATE(completion_date)
      ORDER BY completion_date DESC
      LIMIT 30
    `)) as any[]

    await connection.end()

    return NextResponse.json({
      totalAssets: totalRows[0].total,
      monthlyAssets: monthlyRows[0].total,
      pendingInspection: pendingRows[0].total,
      totalAmount: amountRows[0].total || 0,
      data: completionData,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

