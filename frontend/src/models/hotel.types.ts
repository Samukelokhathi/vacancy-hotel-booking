export type UserRole = "client" | "admin"; // NEW


export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  cellphone: string | number;
  password: string;
  role: UserRole;
  createdat: string; 
}
