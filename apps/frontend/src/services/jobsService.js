import { jobs } from "../mock/jobs";

export async function getJobs() {
  return jobs;
}

export async function getJobsForProvider(providerId) {
  return jobs.filter((job) => job.matchedFor === providerId);
}

export function applyToJob(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (job) {
    job.status = "Aguardando contratação";
    job.proposals += 1;
  }
  return job;
}