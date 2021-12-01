export function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString?.toString()).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}

export function insertDecimal(num) {
    const tempNum = Number(num.replace(/[$.]+/g, ''))
    return (tempNum / 100).toFixed(2)
}

export function subtractDiscount(type, price, goatPoints) {
    if (type === 'kids') {
        const newPrice = Number(price.replace(/[$.]+/g, '')) - Number(500)
        const tempDiscount = Number(newPrice) - Number(goatPoints)
        return (tempDiscount / 100).toFixed(2)
    } else {
        const discount =
            Number(price.replace(/[$.]+/g, '')) - Number(goatPoints)
        return (discount / 100).toFixed(2)
    }
}

export function subtractPrice(type, price) {
    console.log('price', price)
    const tempPrice =
        type === 'kids'
            ? Number(price.replace(/[$.]+/g, '')) - Number(500)
            : price
    console.log('tempPrice', tempPrice)
    return (tempPrice / 100).toFixed(2)
}
