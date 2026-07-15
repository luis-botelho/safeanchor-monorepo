export class PreventiveMaintenance {
  constructor(
    id,
    title,
    description,
    type,
    status,
    vesselId,
    periodicity,
    startDate,
    nextExecution
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.status = status;

    this.vesselId = vesselId;

    this.periodicity = periodicity;

    this.startDate = startDate;

    this.nextExecution = nextExecution;
  }
}