import { useRef } from "react"
import chevronUp from "../assets/chevron-double-up.svg"
import { capitalize } from "../utils"

export default function DetailedView({modalData, getAlias}) {
    const modalBodyRef = useRef(null)
    let title, body
    if(!!!modalData) {
        title = ''
        body = <></>
    }
    else {
        const {name, base_experience, height, weight, forms, abilities, types, stats} = modalData
        const typesAliases = types.map(({type: {name}}) => getAlias(name))
        title = capitalize(name)
        body = 
            <>
                <div>Größe: {height}</div>
                <div>Gewicht: {weight}</div>
                <div>{`Typ${typesAliases.length > 1 ? 'en' : ''}: ${typesAliases.join(', ')}`}</div>
            </>
    }
    
    return (
        <div className="modal fade" id="modal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="modalTitle">{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" ref={modalBodyRef}>{body}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Schließen</button>
                        <button type="button" className="btn btn-primary" aria-label="zum Seitenanfang scrollen" onClick={() => modalBodyRef.current.scrollTo({top: 0, behavior: 'smooth'})}>
                            <img src={chevronUp} alt="chevron double up" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}