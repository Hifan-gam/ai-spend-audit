"use client"

import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface State {
  toasts: ToasterToast[]
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: { type: string; toast?: ToasterToast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = { toasts: [action.toast!, ...memoryState.toasts] }
      break
    case "DISMISS_TOAST":
      if (!action.toastId) {
        memoryState = { toasts: memoryState.toasts.map((t) => ({ ...t, open: false })) }
      } else {
        memoryState = { toasts: memoryState.toasts.map((t) => (t.id === action.toastId ? { ...t, open: false } : t)) }
      }
      break
    case "REMOVE_TOAST":
      memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== action.toastId) }
      break
    default:
      break
  }
  listeners.forEach((l) => l(memoryState))
}

let idCounter = 0
function genId() {
  idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER
  return idCounter.toString()
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    const listener = (s: State) => setState({ ...s })
    listeners.push(listener)
    return () => {
      const i = listeners.indexOf(listener)
      if (i > -1) listeners.splice(i, 1)
    }
  }, [])

  const toastFn = (props: Omit<ToasterToast, 'id'>) => {
    const id = genId()
    const t: ToasterToast = { ...props, id, open: true }
    dispatch({ type: 'ADD_TOAST', toast: t })
    // auto-remove after timeout
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', toastId: id }), 5000)
    return { id, dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
  }

  return { toast: toastFn, dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }), toasts: state.toasts }
}

export const toast = (props: Omit<ToasterToast, 'id'>) => {
  const id = genId()
  const t: ToasterToast = { ...props, id, open: true }
  dispatch({ type: 'ADD_TOAST', toast: t })
  setTimeout(() => dispatch({ type: 'REMOVE_TOAST', toastId: id }), 5000)
  return { id, dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}
