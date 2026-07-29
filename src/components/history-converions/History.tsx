import { HistoryItems } from "./components/history-item/HistoryItem"

import "./History.css"

export function History() {
  return (
    <section className="history">
      <h3>История</h3>

      <div className="history-grid">
        <HistoryItems />
        <HistoryItems />
        <HistoryItems />
        <HistoryItems />
        <HistoryItems />
      </div>
    </section>
  )
}
