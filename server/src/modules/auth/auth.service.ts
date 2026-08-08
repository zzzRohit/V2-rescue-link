import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../utils/Apperror.js";

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};
type LoginUserInput = {
  email: string;
  password: string;
};

export const register = async (userData: RegisterUserInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists" , 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(userData.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: passwordHash,
      phoneNumber: userData.phoneNumber,
    },
  });

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  // Return only what the client needs
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  };
};
export const login = async (loginData: LoginUserInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: loginData.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password",401);
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password",401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  };
}
