import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function ipKey(request) {
  const address = request.ip || request.socket?.remoteAddress || "unknown";
  return ipKeyGenerator(address);
}

function emailKey(request) {
  const email = String(request.body?.email || "")
    .trim()
    .toLowerCase();

  return email ? `${ipKey(request)}:${email}` : ipKey(request);
}

function tooManyRequests(message) {
  return (request, response) =>
    response.status(429).json({ message, requestId: request.id });
}

// Limites por IP e por e-mail são complementares: um bloqueia varreduras
// distribuídas, o outro impede tentativas repetidas na mesma conta.
export function createAuthLimiters() {
  return {
    loginByIp: rateLimit({
      windowMs: FIFTEEN_MINUTES,
      limit: positiveInt(process.env.LOGIN_IP_LIMIT, 20),
      keyGenerator: ipKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitas tentativas de login. Tente novamente mais tarde."),
    }),
    loginByEmail: rateLimit({
      windowMs: FIFTEEN_MINUTES,
      limit: positiveInt(process.env.LOGIN_EMAIL_LIMIT, 10),
      keyGenerator: emailKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitas tentativas para este e-mail. Tente novamente mais tarde."),
    }),
    registerByIp: rateLimit({
      windowMs: ONE_HOUR,
      limit: positiveInt(process.env.REGISTER_IP_LIMIT, 10),
      keyGenerator: ipKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitos cadastros. Tente novamente mais tarde."),
    }),
    registerByEmail: rateLimit({
      windowMs: ONE_HOUR,
      limit: positiveInt(process.env.REGISTER_EMAIL_LIMIT, 3),
      keyGenerator: emailKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitos cadastros para este e-mail."),
    }),
  };
}

export function createResearchLimiters() {
  return {
    submitByIp: rateLimit({
      windowMs: ONE_HOUR,
      limit: positiveInt(process.env.RESEARCH_IP_LIMIT, 20),
      keyGenerator: ipKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitas respostas enviadas. Tente novamente mais tarde."),
    }),
    nonceByIp: rateLimit({
      windowMs: ONE_HOUR,
      limit: positiveInt(process.env.RESEARCH_NONCE_LIMIT, 30),
      keyGenerator: ipKey,
      standardHeaders: false,
      legacyHeaders: false,
      handler: tooManyRequests("Muitas solicitações de consentimento. Tente novamente mais tarde."),
    }),
  };
}
