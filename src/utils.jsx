const root = document.querySelector('html')
const body = document.querySelector('body')

const addClass = (element, cssClass) => element && element.classList.add(cssClass)
const removeClass = (element, cssClass) => element && element.classList.remove(cssClass)

const capitalize = name => name[0].toUpperCase() + name.substring(1)
const getCheckedKeys = obj => obj && Object.entries(obj).reduce((checkedoptions, [key, value]) =>
    value ? checkedoptions.concat(key) : checkedoptions
, [])
const getIdFromURL = url => parseInt(url.split('//')[1].slice(0, -1).split('/').pop())

const maskScrollbar = () => {
    body.style.background = root.getAttribute('theme') === 'light' ? '#fff' : '#202124'
}
const restoreScrollbar = () => {}

const sortArr = (arr, type, key) => { switch (type) {
    case 'desc':
        key ? arr.sort(({[key]: a}, {[key]: b}) => a > b ? -1 : a < b ? 1 : 0)
            : arr.sort((a, b) => a > b ? -1 : a < b ? 1 : 0)
        return
    default:
        key ? arr.sort(({[key]: a}, {[key]: b}) => a > b ? 1 : a < b ? -1 : 0)
            : arr.sort((a, b) => a > b ? 1 : a < b ? -1 : 0)
}}

export { addClass, capitalize, getCheckedKeys, getIdFromURL, maskScrollbar, removeClass, restoreScrollbar, sortArr }