import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  const handleShowButtonClick = (countryName) => {
  setQuery(countryName)
}


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
  countriesToShow.map(c => (
    <div key={c.name.common}>
      {c.name.common} 
      <button onClick={() => handleShowButtonClick(c.name.common)}>
        show
      </button>
    </div>
  ))
)}
   {countriesToShow.length === 1 && (
          <CountryDetail country={countriesToShow[0]} />
        )}
      </div>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  console.log('Is the key loaded?', api_key)
  const capital = country.capital[0]

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [capital, api_key]) 

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.name.common} width="150" />

      {weather && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>temperature {weather.main.temp} Celsius</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt="weather icon" 
          />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default App