import { useMemo, useRef } from 'react'
import searchIcon from '../assets/search.svg'
import sliderIcon from '../assets/sliders.svg'

const sortAliases = [
    {name: 'ascending', alias: 'A → Z'},
    {name: 'descending', alias: 'Z → A'},
    {name: 'byType', alias: 'Nach Typ'}
]

export default function Controls({applyFilter, filter, handleSort, narrowSearch, sort, types}) {
    const searchTextRef = useRef(null)

    // create React elements for Pokemon types
    const typeOptions = useMemo(() => types.map(([name, alias]) =>
        <div key={name} className="option">
            <input
                className="filter-checkbox"
                type="checkbox"
                checked={filter[name]}
                id={name}
                onChange={() => applyFilter(name)}
            ></input>
            <label className="filter-label" htmlFor={name}>{alias}</label>
        </div>
    ), [filter, types])

    const sortOptions = useMemo(() => sortAliases.map(({name, alias}, index) =>
        <div key={index} className="option">
        <input
            className="sort-checkbox"
            type="checkbox"
            checked={sort[name]}
            id={name}
            onChange={() => handleSort(name)}
        ></input>
        <label className="sort-label" htmlFor={name}>{alias}</label>
        </div>
    ), [sort])

    return(
        <>
            <div className="controls-header">
                <div className="input-group searchbar">
                    <span className="input-group-text" id="search-icon"><img src={searchIcon} alt="Such-Icon" /></span>
                    <div className="form-floating">
                        <input ref={searchTextRef} type="text" className="form-control" aria-label="Suche" id="Suchtext" placeholder="Pokémon" onChange={() => narrowSearch(searchTextRef.current.value)}></input>
                        <label htmlFor="Suchtext">Suche</label>
                    </div>
                </div>
                <button className="btn btn-primary settings" data-bs-toggle="collapse" data-bs-target="#filterAndSortControls" aria-expanded="false" aria-controls="filterAndSortControls"><img src={sliderIcon} alt="Einstellungen" /></button>
            </div>
            <div className="accordion collapse" id="filterAndSortControls">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFilter">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#filter-options"
                            aria-expanded="false"
                            aria-controls="filter-options"
                        >
                            Filtern
                        </button>
                    </h2>
                    <div id="filter-options" className="accordion-collapse collapse" aria-labelledby="headingFilter" data-bs-parent=".controls">
                        <div className="accordion-body">{typeOptions}</div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingSort">
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
                    <div id="sort-options" className="accordion-collapse collapse" aria-labelledby="headingSort" data-bs-parent=".controls">
                        <div className="accordion-body">{sortOptions}</div>
                    </div>
                </div>
            </div>
        </>
    )
}