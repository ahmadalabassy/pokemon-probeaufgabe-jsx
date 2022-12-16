
function removeClass(element, cssClass) {
    element && element.classList.remove(cssClass)
}

function addClass(element, cssClass) {
    element && element.classList.add(cssClass)
}

export { addClass, removeClass }