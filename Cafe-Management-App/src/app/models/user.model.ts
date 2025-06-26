import { Role } from "./enums/role.enum";

export interface User {
  id: string;
  userName: string;
  role: Role;
}
