import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    console.log('Fetching all countries...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('Data received! Total countries:', response.data.length)
        setAllCountries(response.data)
      })
  }, [])

  const countriesToShow = allCountries.filter(c => 
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  console.log('Query:', query, '| Matches found:', countriesToShow.length)

  return (
    <div>
      find countries <input value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div>
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
          countriesToShow.map(c => <div key={c.name.common}>{c.name.common}</div>)
        )}

        {countriesToShow.length === 1 && (
          <CountryDetail country={countriesToShow[0]} />
        )}
      </div>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  console.log('Rendering details for:', country.name.common)
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img 
        src={country.flags.png} 
        alt={country.name.common} 
        width="150" 
      />
    </div>
  )
}

export default App