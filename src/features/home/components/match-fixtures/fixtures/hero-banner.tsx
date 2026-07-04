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

interface HeroFixturesProps {
  groups: LeagueGroup[]
  hotLeagues?: LeagueItem[]
  pickedDate: Date
  statusFilter: MatchStatusTabValue
  selectedLeagues: number[]
  onPickedDateChange: (d: Date | null) => void
  onStatusChange: (val: string) => void
  onLeagueChange: (value: number[]) => void
}

function HeroFixtures({
  groups,
  hotLeagues = [],
  pickedDate,
  statusFilter,
  selectedLeagues,
  onPickedDateChange,
  onStatusChange,
  onLeagueChange,
}: HeroFixturesProps) {
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
        className="block size-3.5 shrink-0 bg-current [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] transition-colors duration-100"
      />
    ) : undefined,
    ...(opt.value === MATCH_STATUS_TAB.LIVE
      ? { accent: "live" as const }
      : opt.value === MATCH_STATUS_TAB.ALL
        ? { accent: "neutral" as const }
        : {}),
  }))

  return (
    <section className="flex items-center justify-end gap-2 max-lg:w-full max-lg:flex-wrap [&_button]:max-lg:w-full [&>*]:max-lg:w-full [&>*]:max-lg:flex-1">
      <Select
        options={statusOptions}
        value={statusFilter}
        onValueChange={(val) => onStatusChange(val ?? MATCH_STATUS_TAB.ALL)}
        variant="glass"
        size="sm"
        isActive={statusFilter !== MATCH_STATUS_TAB.ALL}
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
        disabled={statusFilter === MATCH_STATUS_TAB.LIVE}
        maxDate={statusFilter === MATCH_STATUS_TAB.FINISHED ? new Date() : null}
      />
    </section>
  )
}

export default HeroFixtures
