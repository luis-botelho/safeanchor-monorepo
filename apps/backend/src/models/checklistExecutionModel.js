export function createChecklistExecution({
  id,
  templateId,
  vesselId,
  responses,
  executedAt,
}) {
  return {
    id,
    templateId,
    vesselId,
    responses,
    executedAt,
  };
}
