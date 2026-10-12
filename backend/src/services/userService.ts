import { User, UserRole } from "../models/user.types.js";
import { query } from "../config/database.js";
import bcrypt from "bcryptjs";

export const createUser = async (
  name: string,
  surname: string,
  email: string,
  cellphone: number,
  password: string,
  role: UserRole,
) => {
  const { rows } = await query(
    `INSERT INTO users (name,surname,email,cellphone,password,role) VALUES ($1 $2 $3 $4 $5 $6) RETURNING id, name, surname, email, cellphone,  password, `,
  );
  [name, surname, cellphone, email.toLocaleLowerCase(), password, role];

  return rows[0];
};
