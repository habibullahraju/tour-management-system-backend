import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const userData: Partial<IUser> = {};

  if (payload.name !== undefined) userData.name = payload.name;
  if (payload.email !== undefined) userData.email = payload.email;
  const user = await User.create(userData);

  return user;
};
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
