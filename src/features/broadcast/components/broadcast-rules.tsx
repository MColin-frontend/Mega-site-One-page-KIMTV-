import { ShieldAlert } from "lucide-react"

import { useTranslation } from "@/i18n/use-translation"

import { getBroadcastRules } from "@/features/broadcast/broadcast.constants"
import { Typography } from "@/components/ui/typography"

export function BroadcastRules() {
  const { t } = useTranslation()
  const rules = getBroadcastRules(t)

  return (
    <div className="card-glow rounded-12 flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-4 shrink-0 text-red-400" />
        <Typography variant="h5" className="text-white">
          {t("broadcast.rules.title")}
        </Typography>
      </div>

      <Typography variant="body" className="text-white/80">
        {t("broadcast.rules.description")}
      </Typography>

      <div className="flex flex-col gap-2">
        {rules.map((rule, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="rounded-4 mt-0.5 flex size-[18px] shrink-0 items-center justify-center bg-red-500/15 text-red-400">
              <Typography as="span" variant="caption" weight="700" className="text-inherit">
                {i + 1}
              </Typography>
            </span>
            <Typography variant="body" className="text-white">
              {rule}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
