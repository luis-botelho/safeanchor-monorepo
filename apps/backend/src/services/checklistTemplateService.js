import checklistTemplates from "../data/checklistTemplates.js";
import { createChecklistTemplate } from "../models/checklistTemplateModel.js";

export function createTemplate({
  title,
  vesselType,
  items,
}) {
  const template = createChecklistTemplate({
    id: Date.now().toString(),
    title,
    vesselType,
    items,
  });

  checklistTemplates.push(template);

  return template;
}