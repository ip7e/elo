import React, { useState, useEffect } from "react"

const RandomSymbols = ["^", "@", "%", "#", "&", "^", "!", "@", "#"]

const SymbolDisplay = ({ isLoading, value }: any) => {
  const [loadingSymbols, setLoadingSymbols] = useState(["", "", "", ""])

  useEffect(() => {
    let intervalId: any
    if (isLoading) {
      intervalId = setInterval(() => {
        setLoadingSymbols(RandomSymbols.sort(() => Math.random() - 0.5).slice(0, 4))
      }, 250)
    } else {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [isLoading])

  return (
    <>
      {isLoading
        ? loadingSymbols.map((symbol, index) => <span key={index}>{symbol}</span>)
        : value.toString().padStart(4, "0")}
    </>
  )
}

export default SymbolDisplay
