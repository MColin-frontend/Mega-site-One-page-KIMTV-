"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

import { DEFAULT_PREFERENCE_TAGS, type PreferenceTagInterface } from "@/constants/common.constants"

interface ProfilePreferencesProps {
  labels: { title: string; addMore: string }
}

export function ProfilePreferences({ labels }: ProfilePreferencesProps) {
  const [tags, setTags] = useState<PreferenceTagInterface[]>(DEFAULT_PREFERENCE_TAGS)

  function removeTag(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="panel-dark rounded-16 p-6">
      <h3 className="text-16 font-600 mb-4 text-white">{labels.title}</h3>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5"
          >
            <span className="text-13 font-500 text-white">{tag.label}</span>
            <button
              onClick={() => removeTag(tag.id)}
              className="text-text-muted flex size-4 items-center justify-center rounded-full transition-colors hover:text-white"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <button className="text-13 font-500 text-text-muted hover:border-gold/40 hover:text-gold flex items-center gap-1.5 rounded-full border border-dashed border-white/20 px-3 py-1.5 transition-colors">
          <Plus className="size-3.5" />
          {labels.addMore}
        </button>
      </div>
    </div>
  )
}
