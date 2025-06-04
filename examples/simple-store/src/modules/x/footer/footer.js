import { LightningElement, api } from "lwc"

const capitalize = s => s[0].toLocaleUpperCase() + s.substring(1)

const pluralize = s => s.endsWith('s') ? s : `${s}s`

export default class Footer extends LightningElement {
    @api saleItem
    @api saleColor
    @api saleDiscount

    // returns a message about what's currently on sale
    get saleMessage() {
        if (! this.saleItem || ! this.saleColor || ! this.saleDiscount) {
            return 'Nothing on sale now'
        }

        return `${this.saleColor === '*' ? 'All ' : capitalize(this.saleColor)} ` +
               `${this.saleItem === '*' ? 'items' : pluralize(this.saleItem)}` +
               ` ${this.saleDiscount * 100}% off!`
    }
}
