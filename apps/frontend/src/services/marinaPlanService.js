import { marinaPlans, marinaB2b } from "../mock/marinaPlans";

export async function getPlans() {
  return marinaPlans;
}

export async function getB2bData() {
  return marinaB2b;
}