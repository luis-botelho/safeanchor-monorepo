import {
  createExecution,
  getChecklistExecutions,
} from "../services/checklistExecutionService.js";

export function createChecklistExecution(req, res) {
  const { templateId, vesselId, responses } = req.body;

  const execution = createExecution({
    templateId,
    vesselId,
    responses,
  });

  return res.status(201).json(execution);
}

export function listChecklistExecutions(req, res) {
  const executions = getChecklistExecutions();

  return res.json(executions);
}
