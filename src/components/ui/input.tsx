import type { InputHTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type InputVariant = "default" | "ghost"
type InputSize = "sm" | "default" | "lg"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  variant?: InputVariant
  inputSize?: InputSize
  /** Icon bên trái, không có separator */
  leftIcon?: ReactNode
  /** Icon bên phải, không có separator */
  rightIcon?: ReactNode
  /** Node bên trái có separator (vd: "https://", dropdown chọn quốc gia) */
  prefix?: ReactNode
  /** Node bên phải có separator (vd: "px", ".com") */
  suffix?: ReactNode
  wrapperClassName?: string
}

const wrapperVariants: Record<InputVariant, string> = {
  default: cn(
    "border border-input-border bg-input-surface",
    "transition-all duration-200",
    "hover:border-input-border-hover hover:bg-input-surface-hover hover:shadow-input-hover",
    "focus-within:border-input-border-focus focus-within:bg-input-surface-hover",
    "focus-within:shadow-input-focus"
  ),
  ghost: "border-transparent bg-transparent",
}

const sizes: Record<InputSize, string> = {
  sm: "h-8  rounded-8  px-2.5 gap-2   text-12",
  default: "h-9  rounded-10 px-3   gap-2.5 text-14",
  lg: "h-11 rounded-12 px-3.5 gap-3   text-14",
}

const iconSizes: Record<InputSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-4",
}

const affixSizes: Record<InputSize, string> = {
  sm: "px-2   text-12",
  default: "px-2.5 text-13",
  lg: "px-3   text-14",
}

export function Input({
  variant = "default",
  inputSize = "default",
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const hasWrapper = leftIcon || rightIcon || prefix || suffix

  const inputEl = (
    <input
      className={cn(
        "min-w-0 flex-1 bg-transparent text-white outline-none",
        "placeholder:text-placeholder transition-colors duration-200",
        !hasWrapper && wrapperVariants[variant],
        !hasWrapper && sizes[inputSize],
        !hasWrapper && "w-full",
        className
      )}
      {...props}
    />
  )

  if (!hasWrapper) return inputEl

  return (
    <div
      className={cn(
        "group flex w-full items-center",
        sizes[inputSize],
        wrapperVariants[variant],
        wrapperClassName
      )}
    >
      {prefix && (
        <>
          <span
            className={cn(
              "text-muted shrink-0 transition-colors duration-200",
              "group-focus-within:text-gold/70",
              affixSizes[inputSize],
              "-ml-px flex items-center self-stretch"
            )}
          >
            {prefix}
          </span>
          <span className="bg-input-border group-focus-within:bg-gold/20 h-4 w-px shrink-0 transition-colors duration-200" />
        </>
      )}

      {leftIcon && (
        <span
          className={cn(
            "text-muted shrink-0 transition-colors duration-200",
            "group-focus-within:text-gold/70 group-hover:text-white/70",
            iconSizes[inputSize]
          )}
        >
          {leftIcon}
        </span>
      )}

      {inputEl}

      {rightIcon && <span className="shrink-0">{rightIcon}</span>}

      {suffix && (
        <>
          <span className="bg-input-border group-focus-within:bg-gold/20 h-4 w-px shrink-0 transition-colors duration-200" />
          <span
            className={cn(
              "text-muted shrink-0 transition-colors duration-200",
              "group-focus-within:text-gold/70",
              affixSizes[inputSize],
              "-mr-px flex items-center self-stretch"
            )}
          >
            {suffix}
          </span>
        </>
      )}
    </div>
  )
}
