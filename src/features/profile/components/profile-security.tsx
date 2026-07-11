"use client"

import type { ElementType } from "react"
import { Lock, Phone, ShieldCheck } from "lucide-react"

import type { KimtvUser } from "@/lib/auth-cookie"

interface Labels {
  title: string
  phone: string
  password: string
  changeLink: string
  changePassword: string
}

interface ProfileSecurityProps {
  user: KimtvUser
  labels: Labels
}

interface SecurityRowProps {
  icon: ElementType
  label: string
  maskedValue: string
  actionLabel: string
}

function SecurityRow({ icon: Icon, label, maskedValue, actionLabel }: SecurityRowProps) {
  return (
    <div className="rounded-8 flex items-center justify-between gap-4 border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="text-text-muted size-4 shrink-0" strokeWidth={1.8} />
        <div className="flex flex-col gap-0.5">
          <span className="text-12 text-text-muted">{label}</span>
          <span className="text-14 font-500 text-white/70">{maskedValue}</span>
        </div>
      </div>
      <button className="text-12 font-500 text-gold/80 hover:text-gold shrink-0 transition-colors">
        {actionLabel}
      </button>
    </div>
  )
}

function maskPhone(phone: string | undefined): string {
  if (!phone) return "**"
  return "*".repeat(Math.max(2, phone.length - 2)) + phone.slice(-2)
}

export function ProfileSecurity({ user, labels }: ProfileSecurityProps) {
  return (
    <div className="panel-dark rounded-16 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-16 font-600 mb-4 text-white">{labels.title}</h3>
          <div className="flex flex-col gap-3">
            <SecurityRow
              icon={Phone}
              label={labels.phone}
              maskedValue={maskPhone(user.phone)}
              actionLabel={labels.changeLink}
            />
            <SecurityRow
              icon={Lock}
              label={labels.password}
              maskedValue="••••••••"
              actionLabel={labels.changePassword}
            />
          </div>
        </div>

        {/* Shield icon */}
        <div className="shrink-0 pt-1">
          <div className="rounded-16 bg-blue/10 flex size-16 items-center justify-center">
            <ShieldCheck className="text-blue size-8" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
