import checklistExecutions from "../data/checklistExecutionData.js";
import { createChecklistExecution } from "../models/checklistExecutionModel.js";

export function createExecution({
  templateId,
  vesselId,
  responses,
}) {
  const execution = createChecklistExecution({
    id: Date.now().toString(),
    templateId,
    vesselId,
    responses,
    executedAt: new Date().toISOString(),
  });

  checklistExecutions.push(execution);

  return execution;
}

export function getChecklistExecutions() {
  return checklistExecutions;
}
