import { useRef } from "react"
import chevronUp from "../assets/chevron-double-up.svg"

export default function DetailedView(modalData) {
    const modalBodyRef = useRef(null)

    return (
        <div className="modal fade" id="modal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" id="modalTitle">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" ref={modalBodyRef}>
                        {JSON.stringify(modalData)}
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