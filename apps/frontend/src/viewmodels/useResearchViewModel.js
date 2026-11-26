/* ============================================================
   SafeAnchor — ViewModel da pesquisa (MVVM)
   Controla o caminho ramificado, as respostas, o avanço
   automático e o envio. A View apenas desenha.
   ============================================================ */

import { useCallback, useMemo, useRef, useState } from "react";

import { buildPath } from "../mock/researchQuestions";
import {
  buildSummary,
  copySummary,
  persistLocally,
  sendResearchSummary,
} from "../services/researchService";
import {
  isResearchCaptureAllowed,
  readResearchConsent,
} from "../services/researchConsent";

const STORAGE_KEY = "safeanchor.research.draft";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_SAVED_KEYS = 60;
const MAX_TEXT_LENGTH = 2000;

function cleanDraftAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce((result, [key, item]) => {
    if (Object.keys(result).length >= MAX_SAVED_KEYS) return result;

    const cleaned = Array.isArray(item)
      ? item
          .filter((entry) => ["string", "number", "boolean"].includes(typeof entry))
          .slice(0, 30)
          .map((entry) => String(entry).slice(0, 200))
      : ["string", "number", "boolean"].includes(typeof item)
        ? String(item).slice(0, MAX_TEXT_LENGTH)
        : null;

    if (cleaned !== null) result[key.slice(0, 80)] = cleaned;
    return result;
  }, {});
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada a remover */
  }
}

function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const savedAt = Number(draft?.savedAt);

    if (
      draft &&
      draft.answers &&
      Number.isFinite(savedAt) &&
      Date.now() - savedAt <= DRAFT_TTL_MS
    ) {
      return {
        answers: cleanDraftAnswers(draft.answers),
        step: Number.isInteger(draft.step) && draft.step >= 0 ? draft.step : 0,
        startedAt:
          typeof draft.startedAt === "number" ? draft.startedAt : null,
      };
    }

    clearDraft();
  } catch {
    clearDraft();
  }

  return { answers: {}, step: 0, startedAt: null };
}

function writeDraft(draft) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: cleanDraftAnswers(draft.answers),
        step: draft.step,
        startedAt: draft.startedAt,
        savedAt: Date.now(),
      }),
    );
  } catch {
    /* modo privado: seguir sem salvar */
  }
}

export default function useResearchViewModel() {
  const initial = useMemo(readDraft, []);
  const [answers, setAnswers] = useState(initial.answers);
  const [step, setStep] = useState(initial.step);
  const [startedAt, setStartedAt] = useState(initial.startedAt);
  const [finished, setFinished] = useState(false);
  const [consent, setConsent] = useState(() => readResearchConsent());
  const [summary, setSummary] = useState("");
  const [sent, setSent] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wantsContact, setWantsContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const profile = answers.perfil;
  const questions = useMemo(() => buildPath(profile), [profile]);
  const total = questions.length;
  const atFinalStep = step >= total;
  const index = Math.min(step, total - 1);
  const current = questions[index];
  const isLast = index >= total - 1;

  const answered = (question) => {
    const value = answers[question.id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  };

  const needsOther = (question) =>
    Boolean(
      question.options?.some((option) => option.other) &&
        answers[question.id]?.includes("outro")
    );

  const otherValue = (question) => answers[`${question.id}__other`] || "";

  const progress = total > 0 ? Math.min(Math.round((step / total) * 100), 100) : 0;

  function update(nextAnswers, nextStep) {
    setAnswers(nextAnswers);
    setStep(nextStep);
    writeDraft({
      answers: nextAnswers,
      step: nextStep,
      startedAt: startedAt || Date.now(),
    });
    if (!startedAt) setStartedAt(Date.now());
  }

  const selectSingle = useCallback(
    (value) => {
      update({ ...answers, [current.id]: value }, step);
    },
    [answers, current, step]
  );

  const toggleMulti = useCallback(
    (value) => {
      const selected = answers[current.id] || [];
      const exists = selected.includes(value);
      const limit = current.maxChoices;

      let nextSelected;
      if (exists) {
        nextSelected = selected.filter((item) => item !== value);
      } else if (limit && selected.length >= limit) {
        nextSelected = [...selected.slice(1), value];
      } else {
        nextSelected = [...selected, value];
      }

      update({ ...answers, [current.id]: nextSelected }, step);
    },
    [answers, current, step]
  );

  const setText = useCallback(
    (value) => {
      update({ ...answers, [current.id]: value }, step);
    },
    [answers, current, step]
  );

  const setOther = useCallback(
    (value) => {
      update({ ...answers, [`${current.id}__other`]: value }, step);
    },
    [answers, current, step]
  );

  const canContinue = Boolean(
    answered(current) && (!needsOther(current) || otherValue(current))
  );

  const goNext = useCallback(() => {
    update(answers, step + 1);
  }, [answers, step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      update(answers, step - 1);
    }
  }, [answers, step]);

  const skip = useCallback(() => {
    update(answers, step + 1);
  }, [answers, step]);

  const submit = useCallback(
    async (contact) => {
      const contactData = wantsContact ? contact : null;
      const text = buildSummary({
        questions,
        answers,
        contact: contactData,
        startedAt,
      });
      const currentConsent = readResearchConsent();
      const allowed = isResearchCaptureAllowed(currentConsent);
      const responseData = {
        name: contactData?.nome || null,
        contact: contactData?.contato || null,
        city: contactData?.cidade || null,
        profile: contactData?.perfil || answers.perfil || null,
        website: contactData?.website || null,
        answers,
      };

      setIsSubmitting(true);
      setSubmissionError("");

      try {
        let wasCaptured = false;
        if (allowed) {
          const result = await sendResearchSummary(text, {
            consent: currentConsent,
            response: responseData,
          });
          wasCaptured = Boolean(result.captured);
        }

        if (allowed) {
          await persistLocally({
            answers,
            contact: contactData,
            startedAt,
            submittedAt: Date.now(),
          });
        }

        clearDraft();
        setSummary(text);
        setSent(true);
        setConsent(currentConsent);
        setCaptured(wasCaptured);
        setCopied(false);
        return true;
      } catch (error) {
        setSubmissionError(error.message || "Não foi possível enviar. Tente novamente.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, questions, startedAt, wantsContact]
  );

  const finish = useCallback(() => {
    submit(null).then((success) => {
      if (success) setFinished(true);
    });
  }, [submit]);

  const restart = useCallback(() => {
    clearDraft();
    setAnswers({});
    setStep(0);
    setStartedAt(null);
    setFinished(false);
    setConsent(readResearchConsent());
    setSummary("");
    setSent(false);
    setCaptured(false);
    setCopied(false);
    setWantsContact(false);
    setSubmissionError("");
  }, []);

  const copy = useCallback(async () => {
    const ok = await copySummary(summary);
    if (ok) setCopied(true);
  }, [summary]);

  return {
    answers,
    current,
    index,
    total,
    isLast,
    atFinalStep,
    step,
    progress,
    answered,
    needsOther: needsOther(current),
    otherValue: otherValue(current),
    canContinue,
    finished,
    consent,
    summary,
    sent,
    captured,
    copied,
    wantsContact,
    isSubmitting,
    submissionError,
    setWantsContact,
    selectSingle,
    toggleMulti,
    setText,
    setOther,
    goNext,
    goBack,
    skip,
    finish,
    submit,
    restart,
    copy,
  };
}
