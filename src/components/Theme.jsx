import { sun, moon } from './icons'

const HeaderControls = ({theme, toggleTheme}) =>
    <button
        className="btn btn-primary theme-toggler"
        aria-label={theme === 'light' ? 'helles Thema' : 'dunkles Thema'}
        onClick={toggleTheme}
    >
        {theme === 'light' ? sun : moon}
    </button>

export default HeaderControls