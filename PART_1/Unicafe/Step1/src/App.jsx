import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  console.log("App state:", { good, neutral, bad })

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={() => {
        console.log("The Button good clicked")
        setGood(good + 1)
      }}>
        good
      </button>

      <button onClick={() => {
        console.log(" The Buttonneutral clicked")
        setNeutral(neutral + 1)
      }}>
        neutral
      </button>

      <button onClick={() => {
        console.log("The Buttonbad clicked")
        setBad(bad + 1)
      }}>
        bad
      </button>

      <h2>statistics</h2>

      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App