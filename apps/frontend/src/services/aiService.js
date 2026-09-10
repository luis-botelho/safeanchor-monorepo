import { ownerAi, providerAi, marinaAi } from "../mock/ai";

let lastAnswer = null;

export async function getOwnerAi() {
  lastAnswer = null;
  return ownerAi;
}

export async function getProviderAi() {
  lastAnswer = null;
  return providerAi;
}

export async function getMarinaAi() {
  lastAnswer = null;
  return marinaAi;
}

function answer(questions, question) {
  const key = Object.keys(questions).find((q) => q === question);
  lastAnswer = key ? questions[key] : null;
  return lastAnswer || "Entendi. Para esta pergunta, use os dados do plano e da operação simulada do SafeAnchor.";
}

export async function askOwner(question) {
  return answer(ownerAi.answerByQuestion, question);
}

export async function askProvider(question) {
  return answer(providerAi.answerByQuestion, question);
}

export async function askMarina(question) {
  return answer(marinaAi.answerByQuestion, question);
}