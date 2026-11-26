import { getAccessScope } from "../services/accessScopeService.js";
import {
  createDocument,
  getDocuments,
  getDocumentsByVessel,
} from "../services/documentService.js";

export async function listDocuments(request, response) {
  const scope = await getAccessScope(request.user);
  const documents = await getDocuments(scope);

  return response.json(documents);
}

export async function listDocumentsByVessel(request, response) {
  const scope = await getAccessScope(request.user);
  const documents = await getDocumentsByVessel(scope, request.params.vesselId);

  return response.json(documents);
}

export async function createNewDocument(request, response) {
  const body = request.body;

  if (
    !body?.vesselId ||
    !body?.name?.trim() ||
    !body?.category?.trim() ||
    !body?.number?.trim() ||
    !body?.validFrom ||
    !body?.expiresAt
  ) {
    return response.status(400).json({
      message: "Vessel, name, category, number, validFrom and expiresAt are required",
    });
  }

  const scope = await getAccessScope(request.user);
  const document = await createDocument(scope, body);

  if (!document) {
    return response.status(404).json({ message: "Vessel not found" });
  }

  return response.status(201).json(document);
}
