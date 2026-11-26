import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/authService.js";
import { revokeToken } from "../services/tokenRevocation.js";
import {
  isEmail,
  isNonEmptyString,
  isStrongPassword,
} from "../lib/validation.js";

export const register = async (request, response) => {
  const { name, email, password, persona } = request.body;

  if (
    !isNonEmptyString(name, 120) ||
    !isEmail(email) ||
    !isStrongPassword(password)
  ) {
    return response.status(400).json({
      message:
        "Informe nome, e-mail válido e senha com pelo menos 12 caracteres.",
    });
  }

  const user = await registerUser({
    name,
    email,
    password,
    persona,
  });

  if (!user) {
    return response.status(409).json({
      message: "Email already registered",
    });
  }

  return response.status(201).json(user);
};

export const login = async (request, response) => {
  const { email, password } = request.body;

  if (!isEmail(email) || typeof password !== "string" || !password) {
    return response.status(400).json({
      message: "Invalid email or password",
    });
  }

  const user = await loginUser({
    email,
    password,
  });

  if (!user) {
    return response.status(401).json({
      message: "Invalid email or password",
    });
  }

  return response.status(200).json(user);
};

export const logout = async (request, response) => {
  revokeToken(request.user.jti, request.user.exp);

  return response.status(204).end();
};

export const me = async (request, response) => {
  const user = await getUserById(request.user.userId);

  if (!user) {
    return response.status(404).json({
      message: "User not found",
    });
  }

  return response.status(200).json(user);
};