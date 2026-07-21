import "./Conversion.css"

export function Conversion() {
  return (
    <section className="converter">
      <div className="input-row">
        <select>
          <option>RUB</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
        <input type="number" placeholder="1000" />
      </div>

      <div className="arrow">↓</div>

      <div className="output-row">
        <select>
          <option>USD</option>
          <option>EUR</option>
          <option>RUB</option>
        </select>
      </div>

      <button className="convert">Конвертировать</button>

      <div className="result">
        <h2>10.91 USD</h2>
        <p>1 USD = 91.65 RUB</p>
      </div>
    </section>
  )
}
