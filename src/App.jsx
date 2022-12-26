import { useCallback, useEffect, useMemo,  useState } from 'react'

import Controls from './components/Controls'
import DetailedView from './components/DetailedView'
import LoadMore from './components/LoadMore'
import Results from './components/Results'

// Import needed Bootstrap JS plugins
import { Dropdown, Modal } from 'bootstrap'

// Import styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const path = `https://pokeapi.co/api/v2`
const limit = 50

export default function App() {
	const [pokemon, setPokemon] = useState([])
	const [types, setTypes] = useState([])
	const [allPokemonGroupedByType, setAllPokemonGroupedByType] = useState({})
	const [filter, setFilter] = useState({})
	const [sort, setSort] = useState(() => ({ascending: false, descending: false, byType: false}))
	const [offset, setOffset] = useState(0)
	const [modalData, setModalData] = useState(() => null)
	const [pokemonToOpenInModal, setPokemonToOpenInModal] = useState(() => ({id: null, url: null, isOpen: false}))
	const isDataFetched = !!pokemon.length

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

  	// fetch pokemon by id for detailed view
	useEffect(() => {
		const {url, id} = pokemonToOpenInModal
		if(!!id) fetch(url).then(response => response.json()).then(data => setModalData(data))
	}, [pokemonToOpenInModal.id])

	const addTypeToPokemon = (pokemonArr, typesArr, groupsArr) => {
		pokemonArr.forEach(pokemon => {
			typesArr.forEach(([type]) => {
				if(groupsArr[type].find(({pokemon: character}) => pokemon.name === character.name))
				pokemon.types = pokemon.types ? [...pokemon.types, type] : [type]
			})
		})
	}

	// controls functions for filtering and sorting
	const applyFilter = useCallback(name => setFilter(prev => ({...prev, [name]: !prev[name]})), [filter])
	const getAlias = useCallback(name => types.find(([type]) => type === name)[1], [types])
	const handleSort = useCallback(name => {
		if(name === 'ascending') setSort(prev => ({...prev, [name]: !prev[name], descending: false}))
		else if(name === 'descending') setSort(prev => ({...prev, [name]: !prev[name], ascending: false}))
		else setSort(prev => ({...prev, [name]: !prev[name]}))
	}, [sort])
	const updateOffset = useCallback(() => setOffset(prev => prev + limit), [])

  	// modal functions for detailed view
	const openModal = useCallback((id, url) => setPokemonToOpenInModal({id, url, isOpen: true}), [pokemonToOpenInModal.id])

	return (
		<div className="App">
		<header><img src='./pokémon_logo.svg' alt="Pokémon" width="272.7" height="100" /></header>
		<main>
			{useMemo(() => <Controls
				applyFilter={applyFilter}
				filter={filter}
				handleSort={name => handleSort(name)}
				sort={sort}
				types={types}
			/>, [filter, sort, types])}
			{useMemo(() => <Results
				filter={filter}
				getAlias={getAlias}
				isDataFetched={isDataFetched}
				openModal={openModal}
				pokemon={pokemon}
				sort={sort}
			/>, [filter, pokemon, sort])}
			{isDataFetched && <LoadMore
				offset={offset}
				updateOffset={updateOffset}
			/>}
		</main>
		<footer>Probeaufgabe | Solongo</footer>
		{pokemonToOpenInModal.isOpen && modalData && <DetailedView modalData={modalData} getAlias={getAlias} />}
		</div>
	)
}
