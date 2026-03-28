import type { Role } from '../enums';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}
