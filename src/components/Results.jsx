import Pokemon from "./Pokemon"

export default function Results({pokemon, filter, pokemonByType}) {
  const activeFilters = Object.entries(filter).reduce((activeFilters, [key, value]) =>
    value ? activeFilters.concat(key) : activeFilters
  , [])

  // create React elements for Pokemon characters
  function elements(arr) {
    return arr.length ? arr.map(({name, url}) => {
      const id = parseInt(url.split('//')[1].slice(0, -1).split('/').pop())
      return <Pokemon key={id} name={name} pokemonId={id} />
      }) : <h2 className="no-results">{`¯\\_(ツ)_/¯`}</h2>
  }

  return (
    <section className="pokemon">
    {
      elements(activeFilters.length
        ? pokemon.filter(({name, url}) => activeFilters.every(filter =>
          pokemonByType[filter].find(({pokemon: {name: characterName, url: characterUrl}}) =>
            name === characterName && url === characterUrl)
          ))
        : pokemon
      )
    }
    </section>
  )
}