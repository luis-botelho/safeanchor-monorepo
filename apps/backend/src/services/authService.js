import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

const SALT_ROUNDS = 12;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const party = await prisma.party.create({
    data: {
      type: "USER",

      user: {
        create: {
          name,
          email,
          passwordHash,
          role: "USER",
        },
      },
    },

    include: {
      user: {
        select: {
          id: true,
          partyId: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return party.user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      partyId: user.partyId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return {
    user: {
      id: user.id,
      partyId: user.partyId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      partyId: true,
      name: true,
      email: true,
      role: true,
    },
  });
};