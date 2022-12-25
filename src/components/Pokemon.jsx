import { capitalize } from "../utils"

export default function Pokemon({name, id, openModal}) {
    return (
        <div className="character"onClick={openModal} data-bs-toggle="modal" data-bs-target="#modal">
            <h2 className="character-name">{capitalize(name)}</h2>
            <img className="character-img" src={`./pokemon/${id}.svg`} alt={name}/>
            <p className="character-number">{id}</p>
        </div>
    )
}