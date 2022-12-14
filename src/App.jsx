import { useState, useEffect, useRef } from 'react'
import Results from './components/Results'
import './App.css'

const path = `https://pokeapi.co/api/v2`
const limit = 150

export default function App() {
  const [pokemon, setPokemon] = useState([])
  const [types, setTypes] = useState([])
  const [pokemonByType, setPokemonByType] = useState({})
  const [filter, setFilter] = useState({})
  const filterRef = useRef(null)
  const sortRef = useRef(null)

  // fetch pokemon characters and pokemon types
  useEffect(() => {
    const endPoints = [`/pokemon/?limit=${limit}`, `/type`]
    const fetchArr = endPoints.map(point => fetch(`${path}${point}`))
    Promise.all(fetchArr)
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([{results: pokemonData}, {results: typesData}]) => {
      setPokemon([...pokemonData])
      const updatedTypes = []
      const typeFetchArr = []
      let updatedFilter = {}
      let updatedPokemonByType = {}
      typesData.forEach(({url}) => typeFetchArr.push(fetch(url)))
      Promise.all(typeFetchArr)
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => data.map(({name, names, pokemon}) => {
        // inserts array of two, first the type name, second the type alias in German, unknown type is excluded
        updatedTypes.push([name, names.find(({language}) => language.name == 'de').name])
        if(name !== 'unknown') {
          updatedFilter = {...updatedFilter, [name]: false}
          updatedPokemonByType = {...updatedPokemonByType, [name]: pokemon}
        }
      }))
      .finally(() => {
        setTypes(updatedTypes)
        setFilter(updatedFilter)
        setPokemonByType(updatedPokemonByType)
      })
    })
    .catch(error => console.error(error))
  }, [])

  function toggle(toToggle, toRemove) {
    toToggle.classList.toggle("show")
    toRemove.classList.remove("show")
  }

  // create React elements for Pokemon types
  const typeOptions = types.filter(([name]) => name !== 'unknown').map(([name, alias]) => 
    <div key={name}>
      <input
        className="filter-checkbox"
        type="checkbox"
        checked={filter[name]}
        id={name}
        onChange={() => setFilter(prev => ({...prev, [name]: !prev[name]}))}
      ></input>
      <label htmlFor={name}>{alias}</label>
    </div>
  )
  
  return (
    <div className="App">
      <header>
        <img src='./pokémon_logo.svg' href="Pokémon Logo" alt="Pokémon"/>
      </header>
      <main>
        <div className='controls'>
          <button className="btn" onClick={() => toggle(filterRef.current, sortRef.current)}>Filtern</button>
          <button className="btn" onClick={() => toggle(sortRef.current, filterRef.current)}>Sortieren</button>
        </div>
        <div ref={filterRef} className="filter-options smooth-transition">{typeOptions}</div>
        <div ref={sortRef} className="sort-options smooth-transition">Sorting options</div>
        <Results filter={filter} pokemonByType={pokemonByType} pokemon={pokemon} />
      </main>
      <footer>Probeaufgabe | Solongo</footer>
    </div>
  )
}
