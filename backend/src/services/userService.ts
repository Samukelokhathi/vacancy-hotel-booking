import { query } from "../config/database.js";
import bcrypt from "bcryptjs";
import { type User } from "../models/user.types.js";

export const findUserByEmail = async (email: string | null): Promise<User> => {
  const { rows } = await query("SELECT * FROM users WHERE EMAIL = $1", [email]);
  return rows[0] || null;
};

export const createUser = async (
  email: string,
  password: string,
  role: string,
  name: string,
  surname: string,
  cellphone: number,
): Promise<User> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { rows } = await query(
    `INSERT INTO users (name, surname, email, cellphone, password, role) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, name, surname, email, cellphone, role, "createdat"`,
    [name, surname, email.toLocaleLowerCase(), cellphone, hashedPassword, role],
  );

  return rows[0];
};

export const findAllUsers = async (): Promise<User[]> => {
  const { rows } = await query(
    "SELECT id, email, role, name FROM users ORDER BY id DESC",
  );
  return rows;
};

export const findUserById = async (id: number): Promise<User | null> => {
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [
        id,
    ]);
    return rows[0] || null;
}