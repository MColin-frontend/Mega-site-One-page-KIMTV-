"use client"

import { useMemo } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Dialog } from "@base-ui/react/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChartBarStacked, Clock, Plus, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { useTranslation } from "@/i18n"

import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_QUESTION_MAX,
} from "@/features/live/poll.constants"
import { createPollSchema, POLL_DEFAULTS, type PollFormType } from "@/features/live/poll.schema"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/* ── Types ───────────────────────────────────────────────── */

interface PollModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: PollFormType) => void
}

/* ── Step ───────────────────────────────────────────────── */

function Step({
  index,
  label,
  required,
  extra,
  isLast,
  children,
}: {
  index: string
  label: string
  required?: boolean
  extra?: React.ReactNode
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="border-gold/35 from-gold/15 to-gold/5 relative flex size-9 shrink-0 items-center justify-center rounded-full border bg-gradient-to-b shadow-[0_0_16px_rgba(246,195,67,0.15)]">
          <span className="text-11 font-800 text-gold drop-shadow-gold tabular-nums">{index}</span>
        </div>
        {!isLast && (
          <div className="from-gold/25 my-1.5 w-px flex-1 bg-gradient-to-b via-white/8 to-transparent" />
        )}
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-2.5", !isLast ? "pb-6" : "pb-2")}>
        <div className="flex items-center justify-between">
          <span className="text-13 font-600 text-white/90">
            {label}
            {required && <span className="text-gold/60 ml-0.5">*</span>}
          </span>
          {extra}
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── Component ──────────────────────────────────────────── */

export function PollModal({ open, onOpenChange, onSubmit }: PollModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createPollSchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<PollFormType>({
    resolver: zodResolver(schema),
    defaultValues: POLL_DEFAULTS,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({ control, name: "options" })
  const question = useWatch({ control, name: "question" })

  function onValid(data: PollFormType) {
    onSubmit?.(data)
    handleClose()
  }

  function handleClose() {
    reset(POLL_DEFAULTS)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup
            className={cn(
              "card-gold rounded-12 w-full max-w-[460px] overflow-hidden",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            )}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
              <div className="via-gold/70 absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent" />
              <div className="flex items-center gap-3">
                <div className="rounded-10 border-gold/30 from-gold/20 to-gold/5 flex size-9 shrink-0 items-center justify-center border bg-gradient-to-b shadow-[0_4px_16px_rgba(246,195,67,0.2)]">
                  <ChartBarStacked className="text-gold drop-shadow-gold size-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <Dialog.Title className="text-15 font-700 tracking-wide text-white">
                    {t("live.poll.title")}
                  </Dialog.Title>
                  <p className="text-11 text-white/35">{t("live.poll.subtitle")}</p>
                </div>
              </div>
              <Dialog.Close
                onClick={handleClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all duration-300 hover:rotate-90 hover:border-white/20 hover:bg-white/10 hover:text-white/80"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            {/* Body */}
            <form onSubmit={handleSubmit(onValid)}>
              <div className="flex flex-col px-5 pt-5 pb-2">
                {/* 01 */}
                <Step index="01" label={t("live.poll.steps.question")} required>
                  <FormField
                    control={control}
                    name="question"
                    render={(field) => (
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder={t("live.poll.placeholder.question")}
                          rows={3}
                          className="pb-7"
                        />
                        <span
                          className={cn(
                            "text-10 absolute right-3 bottom-2.5 tabular-nums transition-colors",
                            (question?.length ?? 0) >= POLL_QUESTION_MAX
                              ? "text-red-400/80"
                              : "text-white/20"
                          )}
                        >
                          {question?.length ?? 0}/{POLL_QUESTION_MAX}
                        </span>
                      </div>
                    )}
                  />
                </Step>

                {/* 02 */}
                <Step
                  index="02"
                  label={t("live.poll.steps.options")}
                  required
                  extra={
                    <span className="text-10 rounded-full bg-white/5 px-2 py-0.5 text-white/30 tabular-nums">
                      {fields.length}/{POLL_MAX_OPTIONS}
                    </span>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {fields.map((field, i) => (
                      <FormField
                        key={field.id}
                        control={control}
                        name={`options.${i}.value`}
                        render={(f) => (
                          <div className="flex items-center gap-2">
                            <span className="border-gold/25 bg-gold/10 text-10 font-700 text-gold/80 flex size-5 shrink-0 items-center justify-center rounded-full border">
                              {i + 1}
                            </span>
                            <Input
                              {...f}
                              placeholder={`${t("live.poll.placeholder.option")} ${i + 1}`}
                              inputSize="sm"
                            />
                            {fields.length > POLL_MIN_OPTIONS && (
                              <button
                                type="button"
                                onClick={() => remove(i)}
                                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-transparent text-white/20 transition-all hover:border-red-500/20 hover:bg-red-500/8 hover:text-red-400/70"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  {fields.length < POLL_MAX_OPTIONS && (
                    <button
                      type="button"
                      onClick={() => append({ value: "" })}
                      className="rounded-8 text-12 hover:border-gold/30 hover:text-gold/60 flex items-center justify-center gap-1.5 border border-dashed border-white/10 py-2 text-white/25 transition-all"
                    >
                      <Plus className="size-3.5" />
                      {t("live.poll.actions.addOption")}
                    </button>
                  )}
                </Step>

                {/* 03 */}
                <Step index="03" label={t("live.poll.steps.duration")} required isLast>
                  <FormField
                    control={control}
                    name="duration"
                    render={(field) => (
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        inputSize="sm"
                        placeholder={t("live.poll.placeholder.duration")}
                        leftIcon={<Clock className="size-3.5 text-white/30" />}
                        suffix={
                          <span className="text-11 text-white/30">
                            {t("live.poll.labels.minutes")}
                          </span>
                        }
                      />
                    )}
                  />
                </Step>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-5 pb-5">
                <Button
                  type="button"
                  variant="cancel"
                  size="sm"
                  className="flex-1"
                  onClick={handleClose}
                >
                  {t("live.poll.actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  className="font-700 flex-1 text-black"
                  disabled={!isValid}
                >
                  {t("live.poll.actions.submit")}
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
