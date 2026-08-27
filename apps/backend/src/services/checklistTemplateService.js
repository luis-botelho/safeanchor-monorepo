import prisma from "../lib/prisma.js";

export async function createTemplate({
  title,
  vesselType,
  items,
}) {
  return prisma.checklistTemplate.create({
    data: {
      title,
      vesselType,
      items,
    },
  });
}

export async function getChecklistTemplates() {
  return prisma.checklistTemplate.findMany();
}
