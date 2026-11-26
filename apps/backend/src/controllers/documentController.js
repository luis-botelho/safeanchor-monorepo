import { hasRequiredStrings } from "../lib/validation.js";
import { getAccessScope } from "../services/accessScopeService.js";
import {
  createDocument,
  getDocuments,
  getDocumentsByVessel,
} from "../services/documentService.js";

export async function listDocuments(request, response) {
  const scope = await getAccessScope(request.user);
  const documents = await getDocuments(scope, request.app.locals.prisma);

  return response.json(documents);
}

export async function listDocumentsByVessel(request, response) {
  const scope = await getAccessScope(request.user);
  const documents = await getDocumentsByVessel(
    scope,
    request.params.vesselId,
    request.app.locals.prisma,
  );

  return response.json(documents);
}

export async function createNewDocument(request, response) {
  const body = request.body;

  if (
    !hasRequiredStrings(body, ["vesselId", "name", "category", "number"]) ||
    !hasRequiredStrings(body, ["validFrom", "expiresAt"], 40)
  ) {
    return response.status(400).json({
      message: "Vessel, name, category, number, validFrom and expiresAt are required",
    });
  }

  const scope = await getAccessScope(request.user);
  const document = await createDocument(
    scope,
    body,
    request.app.locals.prisma,
  );

  if (!document) {
    return response.status(404).json({ message: "Vessel not found" });
  }

  return response.status(201).json(document);
}
