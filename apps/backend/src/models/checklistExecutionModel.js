export function createExecutionTemplate({
  id,
  templateId,
  vesselId,
  responses,
  executedat,
}) {
  return {
    id,
    templateId,
    vesselId,
    responses,
    executedat,
  };
}
