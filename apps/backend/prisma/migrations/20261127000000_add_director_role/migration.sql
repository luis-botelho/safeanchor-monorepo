-- Novo papel para o administrador da diretoria.
-- Mantido em uma migration separada: ALTER TYPE ADD VALUE nao pode ser
-- usado na mesma transacao que referencia o novo valor.
ALTER TYPE "UserRole" ADD VALUE 'DIRECTOR';
