import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/authService.js";

export const register = async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.status(400).json({
      message: "Name, email and password are required",
    });
  }

  const user = await registerUser({
    name,
    email,
    password,
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

  if (!email || !password) {
    return response.status(400).json({
      message: "Email and password are required",
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

export const me = async (request, response) => {
  const user = await getUserById(request.user.userId);

  if (!user) {
    return response.status(404).json({
      message: "User not found",
    });
  }

  return response.status(200).json(user);
};