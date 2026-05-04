import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setAllCountries(response.data))
  }, [])

  const countriesToShow = allCountries.filter(c => 
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <p className='find'>Find countries <div className='hold'><input className="btn" 
      value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Tye Country' /></div></p>
      <CountryList countries={countriesToShow} setQuery={setQuery} />
    </div>
  )
}
 
export default App