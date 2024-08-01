import { useEffect, useRef } from "react"

export default function useClickedOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handleClick = (e: MouseEvent) =>
      ref.current &&
      ref.current !== e.target &&
      !ref.current.contains(e.target as Node) &&
      callbackRef.current?.()

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [ref])
}
