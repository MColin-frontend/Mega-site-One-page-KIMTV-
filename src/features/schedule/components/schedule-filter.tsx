"use client"

import { useTranslation } from "@/i18n/use-translation"
import {
  MATCH_STATUS_TAB,
  MATCH_STATUS_TABS,
  type MatchStatusTabValue,
} from "@/constants/component/home.constants"

import { DatePicker } from "@/components/ui/datepicker"
import {
  LeagueSelect,
  type LeagueGroup,
  type LeagueItem,
} from "@/components/ui/select/league-select"
import { Select } from "@/components/ui/select/select"

interface ScheduleFilterProps {
  groups: LeagueGroup[]
  hotLeagues?: LeagueItem[]
  pickedDate: Date
  status: MatchStatusTabValue
  selectedLeagues: number[]
  disabled?: boolean
  onPickedDateChange: (d: Date | null) => void
  onStatusChange: (val: MatchStatusTabValue) => void
  onLeagueChange: (ids: number[]) => void
}

export function ScheduleFilter({
  groups,
  hotLeagues = [],
  pickedDate,
  status,
  selectedLeagues,
  disabled,
  onPickedDateChange,
  onStatusChange,
  onLeagueChange,
}: ScheduleFilterProps) {
  const { t } = useTranslation()

  const statusOptions = MATCH_STATUS_TABS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
    icon: opt.icon ? (
      <span
        style={{
          maskImage: `url(${opt.icon.src})`,
          WebkitMaskImage: `url(${opt.icon.src})`,
        }}
        className="block size-3.5 shrink-0 bg-current [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]"
      />
    ) : undefined,
    ...(opt.value === MATCH_STATUS_TAB.LIVE
      ? { accent: "live" as const }
      : opt.value === MATCH_STATUS_TAB.ALL
        ? { accent: "neutral" as const }
        : {}),
  }))

  return (
    <section
      className="flex items-center justify-end gap-2 max-lg:w-full max-lg:flex-wrap [&_button]:max-lg:w-full [&>*]:max-lg:w-full [&>*]:max-lg:flex-1"
      style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
    >
      <Select
        options={statusOptions}
        value={status}
        onValueChange={(val) =>
          onStatusChange((val ?? MATCH_STATUS_TAB.ALL) as MatchStatusTabValue)
        }
        variant="glass"
        size="sm"
        isActive={status !== MATCH_STATUS_TAB.ALL}
      />
      <LeagueSelect
        groups={groups}
        favorites={hotLeagues}
        value={selectedLeagues}
        onValueChange={onLeagueChange}
      />
      <DatePicker
        value={pickedDate}
        onChange={onPickedDateChange}
        size="sm"
        disabled={disabled || status === MATCH_STATUS_TAB.LIVE}
        maxDate={status === MATCH_STATUS_TAB.FINISHED ? new Date() : null}
      />
    </section>
  )
}
