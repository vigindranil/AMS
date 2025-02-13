import { hash, compare } from "bcrypt"
import { query } from "./db"

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hash(password, 10)
  const sql = "INSERT INTO users (email, password, name) VALUES (?, ?, ?)"
  return await query(sql, [email, hashedPassword, name])
}

export async function verifyUser(email: string, password: string) {
  const sql = "SELECT * FROM users WHERE email = ?"
  const users = (await query(sql, [email])) as any[]

  if (users.length === 0) return null

  const user = users[0]
  const isValid = await compare(password, user.password)

  if (!isValid) return null

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

