export const bidToEmoji = (bid: number | null) => {
    switch (bid) {
        case null:
            return '🤷'
        case 0:
            return '🤷'
        case -2:
            return '½'
        case -3:
            return '🏖️'
        case -4:
            return '☕'
        case -5:
            return '🦨'
        default:
            return bid + ""
    }
}
