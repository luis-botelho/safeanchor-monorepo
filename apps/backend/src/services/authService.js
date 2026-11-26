import { randomUUID } from "node:crypto";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getJwtSecret, JWT_AUDIENCE, JWT_ISSUER } from "../lib/jwtConfig.js";
import prisma from "../lib/prisma.js";

const SALT_ROUNDS = 12;

const validPersonas = ["OWNER", "SERVICE_PROVIDER", "MARINA"];

export const registerUser = async ({ name, email, password, persona }) => {
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
          persona: validPersonas.includes(persona) ? persona : "OWNER",
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
          persona: true,
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

  const token = jwt.sign(
    {
      userId: user.id,
      partyId: user.partyId,
      role: user.role,
      persona: user.persona,
      jti: randomUUID(),
    },
    getJwtSecret(),
    {
      expiresIn: "15m",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );

  return {
    user: {
      id: user.id,
      partyId: user.partyId,
      name: user.name,
      email: user.email,
      role: user.role,
      persona: user.persona,
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
      persona: true,
    },
  });
};