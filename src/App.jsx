import { useState, useEffect } from 'react'
import Results from './components/Results'

// Import our custom CSS
import './App.css'

// Import needed Bootstrap's JS
import * as bootstrap from 'bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
const path = `https://pokeapi.co/api/v2`
const limit = 150

export default function App() {
  const [pokemon, setPokemon] = useState([])
  const [types, setTypes] = useState([])
  const [allPokemonGroupedByType, setAllPokemonGroupedByType] = useState({})
  const [filter, setFilter] = useState({})
  const [sort, setSort] = useState(() => ({ascending: false, descending: false, byType: false}))

  // fetch pokemon characters and pokemon types
  useEffect(() => {
    const endPoints = [`/pokemon/?limit=${limit}`, `/type`]
    const fetchArr = endPoints.map(point => fetch(`${path}${point}`))
    const updatedTypes = []
    const typeFetchArr = []
    let updatedFilter = {}
    let updatedAllPokemonGroupedByType = {}
    let updatedPokemon
    Promise.all(fetchArr)
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([{results: pokemonData}, {results: typesData}]) => {
      updatedPokemon = pokemonData
      typesData.forEach(({url}) => typeFetchArr.push(fetch(url)))
      Promise.all(typeFetchArr)
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => data.map(({name, names, pokemon}) => {
        // inserts array of two, first the type name, second the type alias in German, types with no pokemon get excluded
        if(!!pokemon.length) {
          updatedTypes.push([name, names.find(({language}) => language.name == 'de').name])
          updatedFilter = {...updatedFilter, [name]: false}
          updatedAllPokemonGroupedByType = {...updatedAllPokemonGroupedByType, [name]: pokemon}
        }
      }))
      .finally(() => {
        updatedPokemon.forEach(pokemon => {
          updatedTypes.forEach(([type]) => {
            if(updatedAllPokemonGroupedByType[type].find(({pokemon: character}) => pokemon.name === character.name))
              pokemon.types = pokemon.types ? [...pokemon.types, type] : [type]
          })
        })
        setPokemon(updatedPokemon)
        setTypes(updatedTypes)
        setFilter(updatedFilter)
        setAllPokemonGroupedByType(updatedAllPokemonGroupedByType)
      })
    })
    .catch(error => console.error(error))
  }, [])

  function handleSort(name) {
    if(name === 'ascending') setSort(prev => ({...prev, [name]: !prev[name], descending: false}))
    else if(name === 'descending') setSort(prev => ({...prev, [name]: !prev[name], ascending: false}))
    else {
      setSort(prev => ({...prev, [name]: !prev[name]}))
    }
  }

  function removeClass(element, cssClass) {
    element && element.classList.remove(cssClass)
  }

  function addClass(element, cssClass) {
    element && element.classList.add(cssClass)
  }

  function getAlias(name) {
    return types.find(([type]) => type === name)[1]
  }

  // create React elements for Pokemon types
  const typeOptions = types.map(([name, alias]) => 
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

  const sortOptions = [
    {name: 'ascending', alias: 'A → Z'},
    {name: 'descending', alias: 'Z → A'},
    {name: 'byType', alias: 'Nach Typ'}
  ].map(({name, alias}, index) =>
    <div key={index}>
      <input
        className="sort-checkbox"
        type="checkbox"
        checked={sort[name]}
        id={name}
        onChange={() => handleSort(name)}
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
      <div class="accordion" id="controls">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingFilter">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#filter-options"
              aria-expanded="false"
              aria-controls="filter-options"
            >
              Filtern
            </button>
          </h2>
          <div id="filter-options" class="accordion-collapse collapse" aria-labelledby="headingFilter" data-bs-parent=".controls">
            <div class="accordion-body">{typeOptions}</div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingSort">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sort-options"
              aria-expanded="false" aria-controls="sort-options"
            >
              Sortieren
            </button>
          </h2>
          <div id="sort-options" class="accordion-collapse collapse" aria-labelledby="headingSort" data-bs-parent=".controls">
            <div className="accordion-body">{sortOptions}</div>
          </div>
        </div>
      </div>
        <Results
          filter={filter}
          sort={sort}
          allPokemonGroupedByType={allPokemonGroupedByType}
          pokemon={pokemon}
          removeClass={removeClass}
          addClass={addClass}
          getAlias={getAlias}
        />
      </main>
      <footer>Probeaufgabe | Solongo</footer>
    </div>
  )
}
