import { LightningElement, api } from "lwc"
import { colors, items } from 'x/shopState';

export default class Details extends LightningElement {
    @api shopState

    // selects a new item
    changeItem(event) {
        this.shopState.value.selectItem(event.target.value, this.shopState.value.currentItem.color)
    }

    // selects the same item in a different color
    changeColor(event) {
      this.shopState.value.selectItem(this.shopState.value.currentItem.item, event.target.value)
    }

    // computes the <option> parameters for the available colors
    get colorOptions() {
        return colors.map(c => ({
            name: c,
            selected: c === this.shopState.value.currentItem.color,
        }))
    }

    // computes the <option> parameters for the available items
    get itemOptions() {
        return items.map(i => ({
            name: i,
            selected: i === this.shopState.value.currentItem.item,
        }))
    }

    // returns the price that should be rendered strikethrough
    get strikethroughPrice() {
        const regularPrice = this.shopState.value.currentItem.price
        const currentPrice = this.shopState.value.currentItemPrice
  
        if (regularPrice === currentPrice) {
            return ''
        }
        else {
            return `$${regularPrice.toFixed(2)} `
        }
  
    }

    // returns the current price
    get price() {
        return `$${this.shopState.value.currentItemPrice.toFixed(2)}`
    }

    // used by iconStyles() to compute the css style for an item icon
    styleFor(item) {
        const ci = this.shopState.value.currentItem
        return `fill: ${ci.color}; stroke: ${ci.color}; display: ${ci.item === item ? 'inline' : 'none'};`
    }

    // returns the styles to use for the item icons
    get iconStyles() {
        return {
            hat: this.styleFor('hat'),
            shirt: this.styleFor('shirt'),
            boots: this.styleFor('boots'),
        }
    }
}
