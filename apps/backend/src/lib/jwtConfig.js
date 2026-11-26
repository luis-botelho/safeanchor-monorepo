const MIN_SECRET_LENGTH = 32;

export const JWT_ISSUER = "safeanchor";
export const JWT_AUDIENCE = "safeanchor-web";

export const JWT_VERIFY_OPTIONS = {
  algorithms: ["HS256"],
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < MIN_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must have at least ${MIN_SECRET_LENGTH} characters`);
  }

  return secret;
}
