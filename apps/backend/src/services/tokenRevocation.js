// Revogação em memória por jti. Em Vercel, cada instância mantém sua própria
// lista; como o access token dura 15 minutos, a janela de exposição é curta.
// Para revogação global imediata, rotacione JWT_SECRET.
const revokedTokens = new Map();

function pruneExpired() {
  const now = Date.now();

  for (const [jti, expiresAt] of revokedTokens) {
    if (expiresAt <= now) revokedTokens.delete(jti);
  }
}

export function revokeToken(jti, expiresAtSeconds) {
  if (!jti || !Number.isFinite(expiresAtSeconds)) return;

  revokedTokens.set(jti, expiresAtSeconds * 1000);
  pruneExpired();
}

export function isTokenRevoked(jti) {
  if (!jti) return false;

  const expiresAt = revokedTokens.get(jti);

  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    revokedTokens.delete(jti);
    return false;
  }

  return true;
}

export function clearRevokedTokens() {
  revokedTokens.clear();
}
