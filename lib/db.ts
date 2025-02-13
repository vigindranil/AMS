import mysql, { type Connection, type RowDataPacket } from "mysql2/promise"

interface DatabaseConfig {
  host: string
  user: string
  password: string
  database: string
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
}

export async function createConnection(): Promise<Connection> {
  try {
    console.log("Attempting to connect to database with config:", {
      host: config.host,
      user: config.user,
      database: config.database,
    })

    const connection = await mysql.createConnection({
      ...config,
      ssl: undefined,
    })

    console.log("Database connection successful")
    return connection
  } catch (error) {
    console.error("Database connection error:", error)
    throw error
  }
}

export async function query<T extends RowDataPacket>(sql: string, params: any[] = []): Promise<T[]> {
  let connection: Connection | undefined

  try {
    connection = await createConnection()
    console.log("Executing query:", sql)
    console.log("Query parameters:", params)

    const [rows] = await connection.execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error("Query error:", error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log("Connection closed")
    }
  }
}

