import type { ReactNode } from "react"
import ReactDOM from "react-dom"

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}