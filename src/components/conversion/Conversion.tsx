import { useEffect, useState } from "react"

import {
  useCurrencyStore,
  type CurrencyCode,
  type CurrencyRate,
  SUPPORTED_CURRENCIES,
} from "../../store/currencyStore"

import "./Conversion.css"

/**
 * Получить курс валюты из стора
 * RUB = 1, для остальных — из API ЦБ
 */
function getRate(
  charCode: string,
  rates: Record<string, CurrencyRate>,
): number {
  if (charCode === "RUB") return 1
  return rates[charCode]?.rate ?? 0
}

/**
 * Конвертирует сумму из одной валюты в другую через рубли
 */
function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<string, CurrencyRate>,
): number {
  const fromRate = getRate(from, rates)
  const toRate = getRate(to, rates)

  if (fromRate === 0 || toRate === 0) return 0

  const inRub = amount * fromRate
  const inTarget = inRub / toRate

  return Math.round(inTarget * 100) / 100
}

/**
 * Возвращает строку курса
 */
function getRateDisplay(
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<string, CurrencyRate>,
): string {
  if (from === to) return `1 ${from} = 1 ${to}`

  const fromRate = getRate(from, rates)
  const toRate = getRate(to, rates)
  const rate = fromRate / toRate

  return `1 ${from} = ${rate.toFixed(2)} ${to}`
}

export function Conversion() {
  // подписываемся на стор
  const rates = useCurrencyStore((s) => s.rates)
  const loaded = useCurrencyStore((s) => s.loaded)
  const error = useCurrencyStore((s) => s.error)
  const fetchRates = useCurrencyStore((s) => s.fetchRates)
  const addConversion = useCurrencyStore((s) => s.addConversion)

  // локальное состояние UI
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("RUB")
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD")
  const [amount, setAmount] = useState<string>("")
  const [result, setResult] = useState<string | null>(null)

  // загружаем курсы при монтировании
  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  const handleConvert = () => {
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return

    const converted = convert(num, fromCurrency, toCurrency, rates)
    setResult(`${converted.toFixed(2)} ${toCurrency}`)

    // добавляем запись в историю
    const fromRate = getRate(fromCurrency, rates)
    const toRate = getRate(toCurrency, rates)
    const rate = fromRate / toRate

    addConversion({
      fromCurrency,
      toCurrency,
      fromAmount: num,
      toAmount: converted,
      rate,
    })
  }

  return (
    <section className="converter">
      <div className="input-row">
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
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
          onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <button className="convert" onClick={handleConvert}>
        Конвертировать
      </button>

      <div className="result">
        {loaded ? (
          <>
            <h2>{result ?? "____"}</h2>
            <p>{getRateDisplay(fromCurrency, toCurrency, rates)}</p>
          </>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p>Загрузка курсов...</p>
        )}
      </div>
    </section>
  )
}
