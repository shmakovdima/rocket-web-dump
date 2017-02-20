export const RUB = "\u20BD"
export const USD = "\u0024"
export const EUR = "\u20AC"

export function get_currency_letter(currency) {
    switch (currency) {
        case 'RUB': {
            currency = RUB
            break;
        }
        case 'USD': {
            currency = USD
            break;
        }
        case 'EUR': {
            currency = EUR
            break;
        }
    }
    return currency
}