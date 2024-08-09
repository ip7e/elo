import { easeElasticOut } from "d3"
import { animate, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const generateRandomSymbols = (length: number, existing: string) => {
  const randomSymbols = (Math.random() * 100000).toString().slice(0, length)
  const newValue = existing.slice(0, -length) + randomSymbols
  return newValue
}

type Props = {
  isLoading: boolean
  value: number
}
export default function NumberShuffler({ isLoading, value }: Props) {
  const [displayValue, setDisplayValue] = useState(value.toString())
  const [isAnimating, setIsAnimating] = useState(false)

  const nRef = useRef(0)

  const valueRef = useRef<string>(value.toString())
  valueRef.current = value.toString()

  const v = useMotionValue(0)
  const vt = useTransform(v, (n) => Math.round(n))

  useMotionValueEvent(vt, "change", (n) => {
    if (n) nRef.current = n
    setIsAnimating(Boolean(n))
  })

  useEffect(() => {
    let interval: any

    if (isAnimating) {
      interval = setInterval(() => {
        const newValue = generateRandomSymbols(nRef.current, valueRef.current)
        setDisplayValue(newValue)
      }, 50)
    } else {
      setDisplayValue(valueRef.current)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isAnimating])

  useEffect(() => {
    if (isLoading) animate(v, 4, { duration: 1, ease: "circOut" })
    else animate(v, v.get() ? [4, 0] : 0, { duration: 1.5, ease: "circOut" })
  }, [isLoading, v])

  return <>{displayValue}</>
}
