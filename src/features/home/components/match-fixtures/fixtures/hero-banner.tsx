"use client"

import { formatDisplayDate, formatFullDate } from "@/lib/date"

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
import { Typography } from "@/components/ui/typography"

import imgBg from "@assets/images/home/img-match-fixtures.jpg"

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
    <section className="sticky top-[60px] z-40">
      <div
        className="rounded-12 relative flex h-[120px] w-full items-center justify-between overflow-hidden p-5"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url(${imgBg.src}) center/cover`,
        }}
      >
        <div className="flex flex-col gap-0.5">
          <Typography variant="h2" className="text-white">
            {formatDisplayDate(pickedDate)}
          </Typography>
          <Typography variant="caption" className="text-white">
            {formatFullDate(pickedDate)}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={statusOptions}
            value={statusFilter}
            onValueChange={(val) => onStatusChange(val ?? MATCH_STATUS_TAB.ALL)}
            variant="dark"
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
        </div>
      </div>
    </section>
  )
}

export default HeroFixtures
