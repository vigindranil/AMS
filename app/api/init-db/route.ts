import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

const schema = `
-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assets table if not exists
CREATE TABLE IF NOT EXISTS assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id VARCHAR(100),
    asset_name VARCHAR(255) NOT NULL,
    scheme VARCHAR(255),
    implementing_agency VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    work_order_number VARCHAR(100),
    completion_date DATE,
    amount_spent DECIMAL(15, 2),
    development_type ENUM('Maintenance', 'Repair', 'Extension') NOT NULL,
    development_details TEXT,
    photo_url VARCHAR(1000),
    inspection_location TEXT,
    nature_of_work VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_asset_id ON assets(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_name ON assets(asset_name);
CREATE INDEX IF NOT EXISTS idx_scheme ON assets(scheme);
CREATE INDEX IF NOT EXISTS idx_work_order ON assets(work_order_number);
CREATE INDEX IF NOT EXISTS idx_nature_of_work ON assets(nature_of_work);
`

export async function GET() {
  try {
    const connection = await createConnection()

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement)
    }

    await connection.end()

    return NextResponse.json({
      status: "success",
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

