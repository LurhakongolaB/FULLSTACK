import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, []) 


  const countriesToShow = allCountries.filter(c => 
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      find countries <input value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div>
      
        {countriesToShow.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countriesToShow.length > 1 ? (
          countriesToShow.map(c => <div key={c.name.common}>{c.name.common}</div>)
        ) : countriesToShow.length === 1 ? (
          <div>
            <h1>{countriesToShow[0].name.common}</h1>
            <p>capital {countriesToShow[0].capital}</p>
            <p>area {countriesToShow[0].area}</p>
          </div>
        ) : (
          <p>No matches found</p>
        )}
      </div>
    </div>
  )
}

export default App