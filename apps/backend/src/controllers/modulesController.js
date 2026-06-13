import { getModules } from "../services/modulesService.js";

export function listModules(request, response) {
  const modules = getModules();

  response.json(modules);
}
