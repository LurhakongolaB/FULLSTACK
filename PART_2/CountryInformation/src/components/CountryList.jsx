import Weather from './Weather'

const CountryList = ({ countries, setQuery }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(c => (
          <div key={c.name.common}>
            {c.name.common} 
            <button onClick={() => setQuery(c.name.common)}>show</button>
          </div>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name.common} width="150" />
        <Weather capital={country.capital[0]} />
      </div>
    )
  }

  return <p>No matches found</p>
}

export default CountryList