import jwt from "jsonwebtoken";
import { IUser, IDecodedToken } from "../types";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string): IDecodedToken | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as IDecodedToken;
  } catch (error) {
    return null;
  }
};
