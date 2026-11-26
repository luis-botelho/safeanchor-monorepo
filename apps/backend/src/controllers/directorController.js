import {
  getInsights,
  listActions,
  listResponses,
  listUsers,
  updateResponse,
  updateUser,
} from "../services/directorService.js";

const dbFor = (request) => request.app.locals.prisma;
const actorId = (request) => request.user.userId;

export async function responses(request, response) {
  const data = await listResponses(request.query, dbFor(request));
  return response.json(data);
}

export async function insights(request, response) {
  const data = await getInsights(dbFor(request));
  return response.json(data);
}

export async function users(request, response) {
  const data = await listUsers(dbFor(request));
  return response.json(data);
}

export async function actions(request, response) {
  const data = await listActions(request.query, dbFor(request));
  return response.json(data);
}

export async function patchUser(request, response) {
  const updated = await updateUser(
    { ...request.body, id: request.params.id },
    actorId(request),
    dbFor(request),
  );

  if (!updated) {
    return response.status(404).json({ message: "Usuário não encontrado." });
  }

  return response.json(updated);
}

export async function patchResponse(request, response) {
  const updated = await updateResponse(
    { ...request.body, id: request.params.id },
    actorId(request),
    dbFor(request),
  );

  if (!updated) {
    return response.status(404).json({ message: "Resposta não encontrada." });
  }

  return response.json(updated);
}
