import { z } from "zod"

import type { TranslationKey } from "@/i18n/use-translation"

import { POLL_MIN_OPTIONS, POLL_QUESTION_MAX } from "./poll.constants"

export function createPollSchema(t: (key: TranslationKey) => string) {
  return z.object({
    question: z
      .string()
      .min(1, t("live.poll.errors.questionRequired"))
      .max(POLL_QUESTION_MAX, t("live.poll.errors.questionMax")),
    options: z
      .array(z.object({ value: z.string().min(1, t("live.poll.errors.optionRequired")) }))
      .min(POLL_MIN_OPTIONS, t("live.poll.errors.optionsMin")),
    duration: z
      .string()
      .min(1, t("live.poll.errors.durationRequired"))
      .refine((v) => Number(v) > 0, t("live.poll.errors.durationPositive")),
  })
}

export type PollFormType = z.infer<ReturnType<typeof createPollSchema>>

export const POLL_DEFAULTS: PollFormType = {
  question: "",
  options: [{ value: "" }, { value: "" }],
  duration: "",
}
