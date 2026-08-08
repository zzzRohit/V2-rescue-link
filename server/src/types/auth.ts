// src/types/auth.ts

import { Role } from "../../generated/prisma/client.js";


export type AuthenticatedUser = {
  userId: string;
  role: Role;
};