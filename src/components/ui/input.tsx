import type { InputHTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type InputVariant = "default" | "ghost"
type InputSize = "sm" | "default" | "lg"

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant
  inputSize?: InputSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  wrapperClassName?: string
}

const variants: Record<InputVariant, string> = {
  default: "border border-white/10 bg-white/5 focus-within:border-white/20 focus-within:bg-white/8",
  ghost: "border-transparent bg-transparent",
}

const sizes: Record<InputSize, string> = {
  sm: "h-8  rounded-8  px-3 text-12",
  default: "h-9  rounded-10 px-3 text-14",
  lg: "h-10 rounded-12 px-4 text-14",
}

const iconSizes: Record<InputSize, string> = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-4 w-4",
}

export function Input({
  variant = "default",
  inputSize = "default",
  leftIcon,
  rightIcon,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const hasWrapper = leftIcon || rightIcon

  const inputEl = (
    <input
      className={cn(
        "flex-1 bg-transparent text-white outline-none",
        "transition-colors duration-200 placeholder:text-white/30",
        !hasWrapper && variants[variant],
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
        "flex w-full items-center gap-2",
        variants[variant],
        sizes[inputSize],
        wrapperClassName
      )}
    >
      {leftIcon && (
        <span className={cn("shrink-0 text-white/30", iconSizes[inputSize])}>{leftIcon}</span>
      )}
      {inputEl}
      {rightIcon && (
        <span className={cn("shrink-0 text-white/30", iconSizes[inputSize])}>{rightIcon}</span>
      )}
    </div>
  )
}
