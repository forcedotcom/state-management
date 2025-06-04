import { ContextfulLightningElement } from '@lwc/state'
import createShopStateManager from 'x/shopState'

export default class App extends ContextfulLightningElement {
    shopState = createShopStateManager()

    constructor() {
        super()

        // change what's on sale every 15s
        setInterval(() => { this.shopState.value.changeSale() }, 15000)
    }

    putCurrentItemOnSale() {
        const { item, color } = this.shopState.value.currentItem
        this.shopState.value.changeSale(item, color)
    }

    selectGreenBoots() {
        this.shopState.value.selectItem('boots', 'green')
    }
}
