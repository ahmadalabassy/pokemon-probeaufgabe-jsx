import { useState, useEffect } from 'react'
import { addClass, removeClass } from './utils'
import Results from './components/Results'
import Controls from './components/Controls'
import LoadMore from './components/LoadMore'

// Import Bootstrap's JS
import * as bootstrap from 'bootstrap'
// Import styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const path = `https://pokeapi.co/api/v2`
const limit = 150

export default function App() {
  const [pokemon, setPokemon] = useState([])
  const [types, setTypes] = useState([])
  const [allPokemonGroupedByType, setAllPokemonGroupedByType] = useState({})
  const [filter, setFilter] = useState({})
  const [sort, setSort] = useState(() => ({ascending: false, descending: false, byType: false}))
  const [offset, setOffset] = useState(0)
  
  // fetch pokemon characters and pokemon types at initial render
  useEffect(() => {
    const endPoints = [`/pokemon/?offset=${offset}&limit=${limit}`, `/type`]
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
        addTypeToPokemon(updatedPokemon, updatedTypes, updatedAllPokemonGroupedByType)
        setPokemon(updatedPokemon)
        setTypes(updatedTypes)
        setFilter(updatedFilter)
        setAllPokemonGroupedByType(updatedAllPokemonGroupedByType)
      })
    })
    .catch(error => console.error(error))
  }, [])

  // fetch more pokemon characters when load more button is clicked
  useEffect(() => {
    if(offset >= limit) {
      fetch(`${path}/pokemon/?offset=${offset}&limit=${limit}`)
      .then(response => response.json())
      .then(({results}) => {
        setPokemon(prev => {
          addTypeToPokemon(results, types, allPokemonGroupedByType)
          return prev.concat(results)
        })
      })
    }
  }, [offset])

  function handleSort(name) {
    if(name === 'ascending') setSort(prev => ({...prev, [name]: !prev[name], descending: false}))
    else if(name === 'descending') setSort(prev => ({...prev, [name]: !prev[name], ascending: false}))
    else {
      setSort(prev => ({...prev, [name]: !prev[name]}))
    }
  }

  function addTypeToPokemon(pokemonArr, typesArr, groupsArr) {
    pokemonArr.forEach(pokemon => {
      typesArr.forEach(([type]) => {
        if(groupsArr[type].find(({pokemon: character}) => pokemon.name === character.name))
          pokemon.types = pokemon.types ? [...pokemon.types, type] : [type]
      })
    })
  }

  function getAlias(name) {
    return types.find(([type]) => type === name)[1]
  }
  
  return (
    <div className="App">
      <header>
        <img src='./pokémon_logo.svg' href="Pokémon Logo" alt="Pokémon"/>
      </header>
      <main>
        <Controls
          types={types}
          applyFilter={name => setFilter(prev => ({...prev, [name]: !prev[name]}))}
          handleSort={name => handleSort(name)}
          sort={sort}
          filter={filter}
        />
        <Results
          filter={filter}
          sort={sort}
          allPokemonGroupedByType={allPokemonGroupedByType}
          pokemon={pokemon}
          removeClass={removeClass}
          addClass={addClass}
          getAlias={getAlias}
        />
        <LoadMore offset={offset} updateOffset={() => setOffset(prev => prev + limit)} />
      </main>
      <footer>Probeaufgabe | Solongo</footer>
    </div>
  )
}
