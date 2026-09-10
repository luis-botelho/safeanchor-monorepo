import { academy } from "../mock/academy";

export async function getAcademyProfile() {
  return academy;
}

export function getTracks() {
  return academy.tracks;
}

export function getCourseStatus(courseId) {
  return academy.tracks
    .flatMap((track) => track.courses)
    .find((course) => course.id === courseId) || null;
}