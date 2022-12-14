export default function Pokemon({name, pokemonId}) {
    return (
        <div className="character">
            <h2 className="character-name">{name[0].toUpperCase() + name.substring(1)}</h2>
            <img className="character-img" src={`./pokemon/${pokemonId}.svg`} href={name} alt={name}/>
            <p className="character-number">{pokemonId}</p>
        </div>
    )
}