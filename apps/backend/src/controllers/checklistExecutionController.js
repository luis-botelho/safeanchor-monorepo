import {
  createExecution,
  getChecklistExecutions,
  getChecklistExecutionsByVesselId,
} from "../services/checklistExecutionService.js";

export async function createChecklistExecution(req, res) {
  const { templateId, vesselId, responses } = req.body;

  const execution = await createExecution({
    templateId,
    vesselId,
    responses,
  });

  return res.status(201).json(execution);
}

export async function listChecklistExecutions(req, res) {
  const executions = await getChecklistExecutions();

  return res.json(executions);
}

export async function getChecklistExecutionsByVesselIdController(req, res) {
  const { id } = req.params;

  const executions = await getChecklistExecutionsByVesselId(id);

  return res.status(200).json(executions);
}
