import { memo, useState } from "react"
import { capitalize } from "../utils"

const fallbackSrc = "./pokemon/0.png"
const missingSrcIds = [10158, 10182, 10183, 10158, 10121, 10122, 10130, 10131, 10132, 10133, 10134, 10135, 10143, 10145]

export default memo(function Pokemon({id, name, openModal, url}) {
    return (
        <div className="character" onClick={() => openModal(id, url)} data-bs-toggle="modal" data-bs-target="#modal">
            <h2 className="character-name">{capitalize(name)}</h2>
            <img
                className="character-img"
                src={missingSrcIds.includes(id) ? fallbackSrc : `./pokemon/${id}.${id > 649 ? 'png' : 'svg'}`}
                alt={name}
            />
            <p className="character-number">{id}</p>
        </div>
    )
})