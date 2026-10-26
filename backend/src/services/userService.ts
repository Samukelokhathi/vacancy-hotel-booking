import { query } from "../config/database.js";
import bcrypt from "bcryptjs";
import { type User } from "../models/hotel.types.js";
import crypto from "crypto";

export const createGoogleUser = async (
  email: string,
  name: string,
  surname: string,
): Promise<User> => {
  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const { rows } = await query(
    `INSERT INTO users (name, surname, email, password, role)
     VALUES ($1, $2, $3, $4, 'client')
     RETURNING id, name, surname, email, cellphone, role, "createdat"`,
    [name, surname, email.toLowerCase(), hashedPassword],
  );

  return rows[0];
};

export const findUserByEmail = async (email: string | null): Promise<User> => {
  const { rows } = await query("SELECT * FROM users WHERE EMAIL = $1", [
    email?.toLocaleLowerCase(),
  ]);
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
  const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] || null;
};

export const updateUser = async (
  id: number,
  appData: User,
): Promise<User | null> => {
  const { email, role, name, surname, cellphone, password } = appData;
  const { rows } = await query(
    `UPDATE users 
         SET email = $1, 
         role = $2,
         name = $3,
         surname = $4,
         cellphone = $5,
         password = $6
         WHERE id = $7
        RETURNING id, name, surname, cellphone, email, role, createdat`,
    [email, role, name, surname, cellphone, password, id],
  );
  return rows[0] || null;
};

export const deleteUser = async (id: number): Promise<User | null> => {
  const { rows } = await query(" DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return rows[0] || null;
};
