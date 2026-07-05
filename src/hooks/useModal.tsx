import { useCallback, useState } from "react"

type ModalState<T extends string> = Record<T, boolean>

export function useModal<T extends string>(...keys: T[]) {
  const [state, setState] = useState<ModalState<T>>(
    () => Object.fromEntries(keys.map((k) => [k, false])) as ModalState<T>
  )

  const open = useCallback((key: T) => {
    setState((prev) => ({ ...prev, [key]: true }))
  }, [])

  const close = useCallback((key: T) => {
    setState((prev) => ({ ...prev, [key]: false }))
  }, [])

  const toggle = useCallback((key: T) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const setOpen = useCallback((key: T, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  return { state, open, close, toggle, setOpen }
}
