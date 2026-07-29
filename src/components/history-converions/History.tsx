import { useCurrencyStore } from "../../store/currencyStore"

import "./History.css"

export function History() {
  const history = useCurrencyStore((s) => s.history)

  return (
    <section className="history">
      <h3>История</h3>

      {history.length === 0 ? (
        <p className="history-empty">Нет операций</p>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-row">
                <strong>{item.fromAmount}</strong>{" "}
                <span className="history-item-from">{item.fromCurrency}</span>
                <span className="history-item-arrow">↓</span>
                <strong>{item.toAmount.toFixed(2)}</strong>{" "}
                <span className="history-item-to">{item.toCurrency}</span>
              </div>
              <span className="history-item-rate">
                1 {item.fromCurrency} = {item.rate.toFixed(2)} {item.toCurrency}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
