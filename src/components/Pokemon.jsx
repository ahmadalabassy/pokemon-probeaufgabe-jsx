import { useState } from "react"
import { capitalize } from "../utils"
import { starFilledYellow, star } from './icons'

const fallbackSrc = "./pokemon/0.png"
const missingSrcIds = [10158, 10182, 10183, 10158, 10121, 10122, 10130, 10131, 10132, 10133, 10134, 10135, 10143, 10145]

export default function Pokemon({id, name, isFavourite, openModal, url, toggleFavourite}) {
    const [hoveredOver, setHoveredOver] = useState(() => false)

    return (
        <div
            className="character"
            onMouseEnter={() => setHoveredOver(true)}
            onMouseLeave={() => setHoveredOver(false)}
            onClick={event => !!event.target.closest(".bi-star-fill-yellow, .bi-star") ? toggleFavourite(id) : openModal(id, url)}
        >
            <h2 className="character-name" data-bs-toggle="modal" data-bs-target="#modal">{capitalize(name)}</h2>
            {(() => isFavourite || hoveredOver ? isFavourite ? starFilledYellow : star : <></>)()}
            <img
                className="character-img"
                src={missingSrcIds.includes(id) ? fallbackSrc : `./pokemon/${id}.${id > 649 ? 'png' : 'svg'}`}
                alt={name}
                data-bs-toggle="modal" data-bs-target="#modal"
            />
            <p className="character-number" data-bs-toggle="modal" data-bs-target="#modal">{id}</p>
        </div>
    )
}