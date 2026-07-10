export class Maintenance {
  constructor(
    id,
    vesselId,
    title,
    description,
    date,
    status
  ) {
    this.id = id;
    this.vesselId = vesselId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.status = status;
  }
}