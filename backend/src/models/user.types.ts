export type UserRole = "client" | "admin";

export interface User {
  id: number;
  name: string;
  surname: string;
  cellphone: number | string;
  email: string;
  password: string;
  role?: UserRole;
  createdat: Date;
}
