import { getAccessScope } from "../services/accessScopeService.js";
import {
  createExecution,
  getChecklistExecutions,
  getChecklistExecutionsByVesselId,
} from "../services/checklistExecutionService.js";

export async function createChecklistExecution(req, res) {
  const scope = await getAccessScope(req.user);

  const execution = await createExecution(scope, req.body);

  if (!execution) {
    return res.status(404).json({
      message: "Vessel not found",
    });
  }

  return res.status(201).json(execution);
}

export async function listChecklistExecutions(req, res) {
  const scope = await getAccessScope(req.user);

  const executions = await getChecklistExecutions(scope);

  return res.json(executions);
}

export async function getChecklistExecutionsByVesselIdController(req, res) {
  const scope = await getAccessScope(req.user);

  const { id } = req.params;

  const executions = await getChecklistExecutionsByVesselId(scope, id);

  if (!executions) {
    return res.status(404).json({
      message: "Vessel not found",
    });
  }

  return res.status(200).json(executions);
}