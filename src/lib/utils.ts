import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-10",
        "text-11",
        "text-12",
        "text-13",
        "text-14",
        "text-16",
        "text-17",
        "text-18",
        "text-20",
        "text-22",
        "text-24",
        "text-30",
        "text-36",
        "text-48",
        "text-60",
        "text-72",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
