import { create } from "zustand"

// валюта, которую поддерживает приложение
export type CurrencyCode = "RUB" | "USD" | "EUR" | "GBP" | "CNY" | "KZT"

/** список кодов валют в порядке отображения */
export const SUPPORTED_CURRENCIES: CurrencyCode[] = [
  "RUB",
  "USD",
  "EUR",
  "GBP",
  "CNY",
  "KZT",
]

/** отформатированный курс валюты */
export interface CurrencyRate {
  charCode: string
  nominal: number
  rate: number // курс к рублю для 1 единицы валюты
}

/** одна запись в истории конвертаций */
export interface ConversionHistoryItem {
  id: number
  fromCurrency: CurrencyCode
  toCurrency: CurrencyCode
  fromAmount: number
  toAmount: number
  rate: number // курс для этой операции
  timestamp: string // ISO-дата
}

// состояние приложения
interface CurrencyState {
  rates: Record<string, CurrencyRate>
  date: string
  loaded: boolean
  error: string | null

  // история конвертаций
  history: ConversionHistoryItem[]
  addConversion: (item: Omit<ConversionHistoryItem, "id" | "timestamp">) => void

  // запрос курсов валют
  fetchRates: () => Promise<void>
}

const CBRS_URL = "https://www.cbr-xml-daily.ru/daily_utf8.xml"

let nextId = 1

export const useCurrencyStore = create<CurrencyState>((set) => ({
  rates: {},
  date: "",
  loaded: false,
  error: null,
  history: [],

  // запись в историю
  addConversion: (item) => {
    set((state) => {
      const newEntry: ConversionHistoryItem = {
        ...item,
        id: nextId++,
        timestamp: new Date().toISOString(),
      }

      const updated = [newEntry, ...state.history].slice(0, 5)
      return { history: updated }
    })
  },

  // запрос к API 
  fetchRates: async () => {
    set({ error: null, loaded: false })

    try {
      const response = await fetch(CBRS_URL)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const xmlText = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")

      // дата курса из корневого элемента
      const dateEl = xmlDoc.querySelector("ValCurs > Date")
      const date = dateEl?.textContent ?? ""

      // парсим все <Valute>
      const valutes = xmlDoc.querySelectorAll("Valute")
      const rates: Record<string, CurrencyRate> = {}

      valutes.forEach((el) => {
        const charCode = el.querySelector("CharCode")?.textContent?.trim() ?? ""
        const nominal = Number(el.querySelector("Nominal")?.textContent ?? "1")
        const valueText =
          el.querySelector("Value")?.textContent?.replace(",", ".") ?? "0"
        const value = Number(valueText)

        // курс на 1 единицу валюты (делим на номинал)
        const rate = value / nominal

        if (charCode) {
          rates[charCode] = { charCode, nominal, rate }
        }
      })

      set({ rates, date, loaded: true, error: null })
    } catch (e) {
      set({
        rates: {},
        date: "",
        loaded: false,
        error: e instanceof Error ? e.message : "Ошибка загрузки курсов",
      })
    }
  },
}))
