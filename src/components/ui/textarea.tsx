import { forwardRef, type TextareaHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type TextareaVariant = "default" | "ghost"
type TextareaSize = "sm" | "default" | "lg"

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: TextareaVariant
  inputSize?: TextareaSize
}

const variantStyles: Record<TextareaVariant, string> = {
  default: cn(
    "border border-input-border bg-input-surface",
    "transition-all duration-200",
    "hover:border-input-border-hover hover:bg-input-surface-hover hover:shadow-input-hover",
    "focus:border-input-border-focus focus:bg-input-surface-hover",
    "focus:shadow-input-focus"
  ),
  ghost: "border-transparent bg-transparent",
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: "rounded-8  px-2.5 py-1.5 text-12",
  default: "rounded-10 px-3   py-2   text-14",
  lg: "rounded-12 px-3.5 py-2.5 text-14",
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { variant = "default", inputSize = "default", className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 resize-none outline-none",
        "placeholder:text-placeholder text-white",
        "transition-colors duration-200",
        variantStyles[variant],
        sizeStyles[inputSize],
        className
      )}
      {...props}
    />
  )
})
