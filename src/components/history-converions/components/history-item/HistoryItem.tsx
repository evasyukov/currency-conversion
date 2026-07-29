import { useState } from "react"

import "./HistoryItems.css"

export function HistoryItems() {
  const [randomData] = useState(() => ({
    from: Math.floor(Math.random() * 100) + 10,
    to: Math.floor(Math.random() * 8000) + 900,
  }))

  return (
    <div className="history-item">
      <strong>{randomData.from} </strong>
      <span>↓</span>
      <strong>{randomData.to}</strong>
    </div>
  )
}
