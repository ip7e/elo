import NumberFlow from "@number-flow/react"
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

type Props = {
  spin: boolean
  value: number
}

export default function NumberShuffler({ spin, value }: Props) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    let timeout: any

    const shuffle = () => {
      setDisplayValue(Math.round(Math.random() * 10000))
      timeout = setTimeout(() => shuffle(), 500)
    }

    if (spin) timeout = setTimeout(() => shuffle(), 100)

    return () => {
      setDisplayValue(valueRef.current)
      clearTimeout(timeout)
    }
  }, [spin])

  return (
    <NumberFlow
      value={+displayValue}
      transformTiming={spin ? { duration: 500, easing: "linear" } : undefined}
      format={{ notation: "standard", useGrouping: false }}
      trend={-1}
    ></NumberFlow>
  )
}
