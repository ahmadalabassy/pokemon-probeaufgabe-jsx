
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

function getIdFromURL(url) {
    return parseInt(url.split('//')[1].slice(0, -1).split('/').pop())
}

const sortAscending = (arr, key) => arr.sort(({[key]: a}, {[key]: b}) => a > b ? 1 : a < b ? -1 : 0)
const sortDescending = (arr, key) => arr.sort(({[key]: a}, {[key]: b}) => a > b ? -1 : a < b ? 1 : 0)

const capitalize = name => name[0].toUpperCase() + name.substring(1)

export { addClass, capitalize, getCheckedKeys, getIdFromURL, removeClass, sortAscending, sortDescending }