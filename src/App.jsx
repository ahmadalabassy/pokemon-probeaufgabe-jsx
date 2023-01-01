import { useCallback, useEffect, useMemo,  useState } from 'react'
import { getIdFromURL, sortArr } from './utils'

// Import components
import Controls from './components/Controls'
import DetailedView from './components/DetailedView'
import LoadMore from './components/LoadMore'
import Results from './components/Results'
import Theme from './components/Theme'

// Import needed Bootstrap JS plugins
import { Dropdown, Modal } from 'bootstrap'

// Import styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const path = `https://pokeapi.co/api/v2`
const limit = 50
const root = document.querySelector('html')

export default function App() {
	const [theme, setTheme] = useState(() => {
		const theme = localStorage.getItem('theme') || 'light'
		root.setAttribute('theme', theme)
		return theme
	})
	const [allPokemon, setAllPokemon] = useState([])
	const [favourites, setFavourites] = useState(() => {
		const storedFavs = localStorage.getItem('favourites')
		return storedFavs ? JSON.parse(storedFavs) : []
	})
	const [types, setTypes] = useState([])
	const [searchKeyword, setSearchKeyword] = useState('')
	const [filterByFavourites, setFilterByFavourites] = useState(() => false)
	const [filter, setFilter] = useState({})
	const [sort, setSort] = useState(() => ({ascending: false, descending: false, byType: false}))
	const [offset, setOffset] = useState(0)
	const [modalData, setModalData] = useState(() => null)
	const [pokemonToOpenInModal, setPokemonToOpenInModal] = useState(() => ({id: null, url: null, isOpen: false}))
	const isDataFetched = !!allPokemon.length
	// matching pokemon characters passed on to Results component for rendering
	const pokemon = useMemo(() => JSON.parse(JSON.stringify((() => {
		// narrow down matches through filter by favourites
		const matches = filterByFavourites ? allPokemon.filter(({id}) => favourites.some(favId => favId === id)) : allPokemon
		// further narrow down matches through search by keyword
		return (!!searchKeyword
			? matches.filter(({id, name, types}) =>
				name.includes(searchKeyword) || types.includes(searchKeyword) || id.toString().includes(searchKeyword)) 
			: matches)
	})())), [allPokemon, favourites, filterByFavourites, searchKeyword])

	// fetch all pokemon characters and pokemon types at initial render
	useEffect(() => {
		const endPoint = [`/type`]
		const typeFetchArr = []
		const updatedTypes = []
		const updatedAllPokemon = []
		let updatedFilter = {}
		let allPokemonGroupedByType = {}
		fetch(`${path}${endPoint}`)
		.then(response => response.json())
		.then(({results: typesData}) => {
			typesData.forEach(({url}) => typeFetchArr.push(fetch(url)))
			Promise.all(typeFetchArr)
			.then(responses => Promise.all(responses.map(response => response.json())))
			.then(data => data.map(({name, names, pokemon}) => {
				if(!!pokemon.length) {
					for (const {pokemon: {name, url}} of pokemon) {
						const id = getIdFromURL(url)
						// only new characters get added, duplicates are skipped
						!updatedAllPokemon.some(({id: pokemonId}) => pokemonId === id) 
							&& updatedAllPokemon.push({id, name, url})
					}
					// inserts array of two, first the type name, second the type alias in German, types with no pokemon get excluded
					updatedTypes.push([name, names.find(({language}) => language.name == 'de').name])
					updatedFilter = {...updatedFilter, [name]: false}
					allPokemonGroupedByType = {...allPokemonGroupedByType, [name]: pokemon}
				}
			}))
			.finally(() => {
				sortArr(updatedAllPokemon, 'asc', 'id')
				addTypeToPokemon(updatedAllPokemon, updatedTypes, allPokemonGroupedByType)
				setAllPokemon(updatedAllPokemon)
				setTypes(updatedTypes)
				setFilter(updatedFilter)
			})
		})
		.catch(error => console.error(error))
	}, [])

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

	// theme
	const toggleTheme = useCallback(() => setTheme(prev => {
		const updatedTheme = prev === 'light' ? 'dark' : 'light'
		localStorage.setItem('theme', updatedTheme)
		root.setAttribute('theme', updatedTheme)
		return updatedTheme
	}), [])

	// controls functions for search, filtering and sorting
	const applyFilter = useCallback(name => setFilter(prev => ({...prev, [name]: !prev[name]})), [filter])
	const filterByKeyword = keyword => setSearchKeyword(keyword)
	const getAlias = useCallback(name => types.find(([type]) => type === name)[1], [types])
	const handleSort = useCallback(name => {
		if(name === 'ascending') setSort(prev => ({...prev, [name]: !prev[name], descending: false}))
		else if(name === 'descending') setSort(prev => ({...prev, [name]: !prev[name], ascending: false}))
		else setSort(prev => ({...prev, [name]: !prev[name]}))
	}, [sort])
	const updateOffset = useCallback(() => setOffset(prev => prev + limit), [])
	
	// results functions
	const toggleFavourite = id => {
		const updatedFavs = favourites.includes(id) ? favourites.filter(favId => favId !== id) : [...favourites, id]
		setFavourites(updatedFavs)
		localStorage.setItem('favourites', JSON.stringify(updatedFavs))
	}

  	// modal functions for detailed view
	const openModal = useCallback((id, url) => setPokemonToOpenInModal({id, url, isOpen: true}), [pokemonToOpenInModal.id])

	return (
		<div className="App">
			<header>
				<img src='./pokémon_logo.svg' alt="Pokémon" width="272.7" height="100" />
				<Theme theme={theme} toggleTheme={toggleTheme} />
			</header>
			<main>
				{useMemo(() => <Controls
					applyFilter={applyFilter}
					filter={filter}
					filterByKeyword={filterByKeyword}
					handleSort={name => handleSort(name)}
					sort={sort}
					toggleFilterByFavourites={() => setFilterByFavourites(prev => !prev)}
					types={types}
				/>, [filter, sort, types])}
				{useMemo(() => <Results
					favourites={favourites}
					filter={filter}
					getAlias={getAlias}
					isDataFetched={isDataFetched}
					limit={limit}
					offset={offset}
					openModal={openModal}
					pokemon={pokemon.slice(0, limit + offset)}
					searchKeyword={searchKeyword}
					sort={sort}
					toggleFavourite={toggleFavourite}
				/>, [allPokemon, favourites, filter, offset, pokemon, searchKeyword, sort])}
				{isDataFetched && pokemon.length > offset + limit && <LoadMore
					offset={offset}
					updateOffset={updateOffset}
				/>}
			</main>
			<footer>Probeaufgabe | Solongo</footer>
			{useMemo(() => <DetailedView modalData={modalData} getAlias={getAlias} />, [modalData])}
		</div>
	)
}
