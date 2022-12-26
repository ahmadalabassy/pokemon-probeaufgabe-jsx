import { useMemo } from 'react'

const sortAliases = [
    {name: 'ascending', alias: 'A → Z'},
    {name: 'descending', alias: 'Z → A'},
    {name: 'byType', alias: 'Nach Typ'}
]

export default function Controls({applyFilter, filter, handleSort, sort, types}) {    
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
        <div className="accordion controls">
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
    )
}