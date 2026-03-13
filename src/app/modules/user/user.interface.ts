import { Types } from "mongoose";

export enum Role {
  SUPPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
  ADMIN = "ADMIN",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  adress?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVarified?: string;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
