import { animate, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const generateRandomSymbols = (length: number, existing: string) => {
  const randomSymbols = (Math.random() * 100000).toString().slice(0, length)
  const newValue = existing.slice(0, -length) + randomSymbols
  return newValue
}

const SymbolDisplay = ({ isLoading, value }: any) => {
  const [displayValue, setDisplayValue] = useState(value.toString())
  const [isAnimating, setIsAnimating] = useState(false)

  const nRef = useRef(0)

  const valueRef = useRef<string>(value.toString())
  valueRef.current = value.toString()

  const v = useMotionValue(0)
  const vt = useTransform(v, (n) => Math.round(n))

  useMotionValueEvent(vt, "change", (n) => {
    console.log(n)
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
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isAnimating])

  useEffect(() => {
    if (isLoading) animate(v, 4, { duration: 1 })
    else animate(v, 0, { duration: 1 })
  }, [isLoading, v])

  return <>{displayValue}</>
}

export default SymbolDisplay
