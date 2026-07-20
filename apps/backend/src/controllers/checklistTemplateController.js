import { createTemplate } from "../services/checklistTemplateService.js";

export function createChecklistTemplate(req, res) {
  const { title, vesselType, items } = req.body;

  const template = createTemplate({
    title,
    vesselType,
    items,
  });

  return res.status(201).json(template);
}