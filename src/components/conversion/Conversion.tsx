import { useState } from "react"

import "./Conversion.css"

// Допустимые валюты
type Currency = "RUB" | "USD" | "EUR"

// Курсы к рублю: сколько рублей стоит 1 единица каждой валюты
const RATES: Record<Currency, number> = {
  RUB: 1,
  USD: 79.6,
  EUR: 90.67,
}

/**
 * Конвертирует сумму из одной валюты в другую.
 * Перевод идёт через рубли: сначала сумма в рубли, потом в целевую валюту.
 */
function convert(amount: number, from: Currency, to: Currency): number {
  // если валюты совпадают, возвращаем значение
  if (from === to) return amount

  const inRub = amount * RATES[from]
  const inTarget = inRub / RATES[to]

  return Math.round(inTarget * 100) / 100
}

/**
 * Возвращает строку вида "1 USD = 79.60 RUB" для отображения курса.
 */
function getRateDisplay(from: Currency, to: Currency): string {
  if (from === to) return `1 ${from} = 1 ${to}`
  if (from === "EUR" && to === "USD") return `1 EUR = 1.14 USD`
  if (from === "USD" && to === "EUR")
    return `1 USD = ${(1 / 1.14).toFixed(2)} EUR`

  const rate = RATES[from] / RATES[to]
  return `1 ${from} = ${rate.toFixed(3)} ${to}`
}

/**
 * Основной компонент конвертера.
 * Управляет состоянием: какие валюты выбраны, введённая сумма и результат.
 */
export function Conversion() {
  const [fromCurrency, setFromCurrency] = useState<Currency>("RUB")
  const [toCurrency, setToCurrency] = useState<Currency>("USD")
  const [amount, setAmount] = useState<string>("")
  const [result, setResult] = useState<string | null>(null)

  // функция конвертации валюты
  const handleConvert = () => {
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return

    const converted = convert(num, fromCurrency, toCurrency)

    setResult(`${converted.toFixed(2)} ${toCurrency}`)
  }

  return (
    <section className="converter">
      <div className="input-row">
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value as Currency)}
        >
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <input
          type="number"
          placeholder="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="arrow">↓</div>

      <div className="output-row">
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value as Currency)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="RUB">RUB</option>
        </select>
      </div>

      <button className="convert" onClick={handleConvert}>
        Конвертировать
      </button>

      <div className="result">
        <h2>{result ?? "—"}</h2>
        <p>{getRateDisplay(fromCurrency, toCurrency)}</p>
      </div>
    </section>
  )
}
