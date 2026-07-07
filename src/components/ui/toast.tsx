"use client"

import { toast as reactToast, ToastContainer } from "react-toastify"
import Image from "next/image"
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react"

import { Typography } from "@/components/ui/typography"

import "react-toastify/dist/ReactToastify.css"

export function Toaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      closeOnClick={false}
      pauseOnHover
      draggable={false}
      closeButton={false}
      toastStyle={{ background: "transparent", boxShadow: "none", padding: 0, marginBottom: 8 }}
      style={{ width: "380px" }}
    />
  )
}

const VARIANTS = {
  success: { bg: "rgba(76,175,80,0.85)", Icon: CheckCircle },
  error: { bg: "rgba(244,67,54,0.85)", Icon: XCircle },
  info: { bg: "rgba(41,182,246,0.85)", Icon: Info },
  warning: { bg: "rgba(255,152,0,0.85)", Icon: AlertTriangle },
} as const

type Variant = keyof typeof VARIANTS

function ToastContent({
  id,
  title,
  description,
  variant,
  image,
}: {
  id: string | number
  title: string
  description?: string
  variant: Variant
  image?: string
}) {
  const { bg, Icon } = VARIANTS[variant]
  return (
    <div
      style={{
        background: bg,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRadius: 8,
        width: "100%",
      }}
      className="flex w-full items-center gap-3 px-4 py-3"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          width={36}
          height={36}
          className="shrink-0 rounded-full object-cover"
        />
      ) : (
        <Icon size={22} color="#fff" className="shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <Typography variant="body-sm" weight="600" className="text-white">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" className="mt-0.5 text-white/80">
            {description}
          </Typography>
        )}
      </div>

      <button
        onClick={() => reactToast.dismiss(id)}
        className="ml-2 shrink-0 text-white/60 transition-colors hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  )
}

function show(variant: Variant, title: string, description?: string, image?: string) {
  const id = `${variant}-${Date.now()}`
  reactToast(
    <ToastContent
      id={id}
      title={title}
      description={description}
      variant={variant}
      image={image}
    />,
    { toastId: id }
  )
}

export const toast = {
  success: (title: string, description?: string, image?: string) =>
    show("success", title, description, image),
  error: (title: string, description?: string, image?: string) =>
    show("error", title, description, image),
  info: (title: string, description?: string, image?: string) =>
    show("info", title, description, image),
  warning: (title: string, description?: string, image?: string) =>
    show("warning", title, description, image),
}
