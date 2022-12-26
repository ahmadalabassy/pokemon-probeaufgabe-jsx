import { useRef } from "react"
import chevronUp from "../assets/chevron-double-up.svg"
import { capitalize } from "../utils"

export default function DetailedView({
    modalData: {name, base_experience, height, weight, forms, abilities, types, stats}, getAlias
}) {
    const modalBodyRef = useRef(null)
    const typesAliases = types.map(({type: {name}}) => getAlias(name))
    return (
        <div className="modal fade" id="modal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="modalTitle">{capitalize(name)}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" ref={modalBodyRef}>
                        <div>Größe: {height}</div>
                        <div>Gewicht: {weight}</div>
                        <div>{`Typ${typesAliases.length > 1 ? 'en' : ''}: ${typesAliases.join(', ')}`}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" data-bs-dismiss="modal">Schließen</button>
                        <button type="button" className="btn" aria-label="zum Seitenanfang scrollen" onClick={() => modalBodyRef.current.scrollTo({top: 0, behavior: 'smooth'})}>
                            <img src={chevronUp} alt="chevron double up" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}