import { useMemo, useRef } from 'react'
import { addClass, getCheckedKeys, removeClass } from '../utils'
import Pokemon from './Pokemon'

export default function Results({filter, getAlias, isDataFetched, openModal, pokemon, sort}) {
	const sectionRef = useRef(null)
	const checkedTypes = useMemo(() => getCheckedKeys(filter), [filter])
	const checkedSort = useMemo(() => getCheckedKeys(sort), [sort])

	const pokemonElement = ({name, url}) => {
		const id = parseInt(url.split('//')[1].slice(0, -1).split('/').pop())
		return <Pokemon key={id} id={id} name={name} openModal={() => openModal(id, url)} />
	}
	const pokemonElements = matches => matches.map(match => pokemonElement(match))

  // create React elements for Pokemon characters
  function applyControls() {
    addClass(sectionRef.current, "pokemon")
    const areFiltersApplied = !!checkedTypes.length
    const availableTypes = areFiltersApplied ? checkedTypes : Object.keys(filter)
    let data = areFiltersApplied
		? JSON.parse(JSON.stringify(pokemon)).filter(({types}) => checkedTypes.every(type => types.includes(type)))
		: JSON.parse(JSON.stringify(pokemon))
    
    // if no results match filter(s) applied; array is empty, dummy element is returned
    if (!!!data.length) {
		removeClass(sectionRef.current, "pokemon")
		return <h2 className="no-results">{`¯\\_(ツ)_/¯`}</h2>
    }

    // sorting elements
    let order = 0  // 0: value not yet determined or no order specified, 1: alphabetically ascending, -1: alphabetically descending
    if(checkedSort.includes('ascending')) {
		order = 1
		data.sort(({name: a}, {name: b}) => a > b ? 1 : a < b ? -1 : 0)
    }
    else if(checkedSort.includes('descending')) {
		order = -1
		data.sort(({name: a}, {name: b}) => a > b ? -1 : a < b ? 1 : 0)
    }
    if(!!!checkedSort.includes('byType')) return pokemonElements(data)
    /* sorting by type
       if no type is checked in filters, then data includes all types.
       types to be sorted alphabetically in ascending or descending order as well if the respective option is checked */
    else {
		removeClass(sectionRef.current, "pokemon")
		// sorting available types
		if(order === 1) availableTypes.sort()
		else if(order === -1) availableTypes.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
		// filtering pokemon by type and constructing pokemon elements
		return availableTypes.reduce((elements, type) => {
			const matches = data.filter(({types}) => types.includes(type))
			return (matches.length
			? [...elements,
				<div key={type} className="type-group">
					<h2 className="type-group-title">{getAlias(type)}</h2>
					<div className="pokemon">{pokemonElements(matches)}</div>
				</div>]
			: elements)
		}, [])
    }
  }

  	return (
		<section ref={sectionRef}>
			{isDataFetched ? applyControls() : <div className="loading">Laden...</div>}
		</section>
	)
}