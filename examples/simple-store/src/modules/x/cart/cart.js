import { LightningElement } from 'lwc'
import { fromContext } from '@lwc/state'
import createShopStateManager from 'x/shopState'

export default class Cart extends LightningElement {
    // finds the shopState in x/app
    shopState = fromContext(createShopStateManager)

    get itemsInCart() {
        const itemCount = this.shopState.value.cart.items.length
        return `${itemCount} item${itemCount !== 1 ? 's' : ''}`
    }

    get cartTotal() {
        return `$${this.shopState.value.cartTotal.toFixed(2)}`
    }
}
