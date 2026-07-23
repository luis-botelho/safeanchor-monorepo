import {
  createExecution,
  getChecklistExecutions,
  getChecklistExecutionsByVesselId,
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

export function getChecklistExecutionsByVesselIdController(req, res) {
  const { id } = req.params;

  const executions = getChecklistExecutionsByVesselId(id);

  return res.status(200).json(executions);
}
