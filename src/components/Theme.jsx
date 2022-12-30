import { sun, moon } from './icons'

export default function HeaderControls({theme}) {
    return <button className="btn btn-primary theme" aria-label={theme ? 'helles Thema' : 'dunkles Thema'}>{theme ? sun : moon}</button>
}