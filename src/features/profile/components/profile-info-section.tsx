"use client"

import { useState } from "react"
import type { ElementType } from "react"
import { Lock, Mail, Pencil, Phone } from "lucide-react"

import type { KimtvUser } from "@/lib/auth-cookie"

import { Button } from "@/components/ui/button"

import { updateProfileServerAction } from "../actions/update-profile"
import type { UpdateProfilePayloadInterface } from "../profile.models"

interface Labels {
  title: string
  editProfile: string
  phone: string
  email: string
  password: string
  change: string
  save: string
  cancel: string
  saving: string
  saveSuccess: string
  saveError: string
}

interface ProfileInfoSectionProps {
  user: KimtvUser
  labels: Labels
}

function maskPhone(phone: string | undefined): string {
  if (!phone) return "—"
  if (phone.length <= 4) return phone
  return phone.slice(0, 3) + "*".repeat(phone.length - 5) + phone.slice(-2)
}

function maskEmail(email: string | undefined): string {
  if (!email) return "—"
  const [local, domain] = email.split("@")
  if (!domain) return email
  const visible = local.slice(0, Math.min(3, local.length))
  return `${visible}***@${domain}`
}

interface FieldRowProps {
  icon: ElementType
  label: string
  value: string
  actionLabel: string
  editing?: boolean
  editValue?: string
  onEdit?: () => void
  onChangeValue?: (v: string) => void
}

function FieldRow({
  icon: Icon,
  label,
  value,
  actionLabel,
  editing,
  editValue,
  onEdit,
  onChangeValue,
}: FieldRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="text-text-muted size-3.5" strokeWidth={1.8} />
        <span className="text-12 font-500 tracking-1 text-text-muted uppercase">{label}</span>
      </div>
      <div className="rounded-8 flex items-center justify-between gap-3 border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
        {editing && onChangeValue ? (
          <input
            autoFocus
            type="text"
            defaultValue={editValue}
            onChange={(e) => onChangeValue(e.target.value)}
            className="text-14 placeholder:text-text-muted flex-1 bg-transparent text-white outline-none"
          />
        ) : (
          <span className="text-14 text-white/80">{value}</span>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-12 font-500 text-gold/80 hover:text-gold shrink-0 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export function ProfileInfoSection({ user, labels }: ProfileInfoSectionProps) {
  const [editing, setEditing] = useState(false)
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null)
  const [draft, setDraft] = useState<UpdateProfilePayloadInterface>({
    name: user.name ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
  })

  async function handleSave() {
    setPending(true)
    setFeedback(null)
    const res = await updateProfileServerAction(draft)
    setPending(false)
    setFeedback({
      text: res.success ? labels.saveSuccess : (res.message ?? labels.saveError),
      ok: res.success,
    })
    if (res.success) setEditing(false)
  }

  return (
    <div className="panel-dark rounded-16 p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-16 font-600 text-white">{labels.title}</h3>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="gradient" size="sm" onClick={handleSave} disabled={pending}>
              {pending ? labels.saving : labels.save}
            </Button>
            <Button
              variant="cancel"
              size="sm"
              onClick={() => {
                setEditing(false)
                setFeedback(null)
              }}
              disabled={pending}
            >
              {labels.cancel}
            </Button>
          </div>
        ) : (
          <Button variant="gradient" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
            <Pencil className="size-3.5" />
            {labels.editProfile}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <FieldRow
          icon={Phone}
          label={labels.phone}
          value={editing ? (draft.phone ?? "") : maskPhone(user.phone)}
          actionLabel={labels.change}
          editing={editing}
          editValue={draft.phone}
          onEdit={editing ? undefined : () => setEditing(true)}
          onChangeValue={editing ? (v) => setDraft((p) => ({ ...p, phone: v })) : undefined}
        />
        <FieldRow
          icon={Mail}
          label={labels.email}
          value={editing ? (draft.email ?? "") : maskEmail(user.email)}
          actionLabel={labels.change}
          editing={editing}
          editValue={draft.email}
          onEdit={editing ? undefined : () => setEditing(true)}
          onChangeValue={editing ? (v) => setDraft((p) => ({ ...p, email: v })) : undefined}
        />
      </div>

      <div className="mt-4">
        <FieldRow
          icon={Lock}
          label={labels.password}
          value="••••••••"
          actionLabel={labels.change}
          onEdit={() => {}}
        />
      </div>

      {feedback && (
        <p className={`text-12 mt-3 ${feedback.ok ? "text-success" : "text-live"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  )
}
