export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
