import {
  createTemplate,
  getChecklistTemplates,
} from "../services/checklistTemplateService.js";

export async function createChecklistTemplate(req, res) {
  const { title, vesselType, items } = req.body;

  const template = await createTemplate({
    title,
    vesselType,
    items,
  });

  return res.status(201).json(template);
}

export async function listChecklistTemplates(req, res) {
  const templates = await getChecklistTemplates();

  return res.json(templates);
}
