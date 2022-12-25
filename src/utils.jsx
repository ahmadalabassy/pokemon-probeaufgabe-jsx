
function removeClass(element, cssClass) {
    element && element.classList.remove(cssClass)
}

function addClass(element, cssClass) {
    element && element.classList.add(cssClass)
}

function getCheckedKeys(obj) {
    if(obj) return Object.entries(obj).reduce((checkedoptions, [key, value]) =>
        value ? checkedoptions.concat(key) : checkedoptions
    , [])
}

const capitalize = name => name[0].toUpperCase() + name.substring(1)

export { addClass, removeClass, getCheckedKeys, capitalize }