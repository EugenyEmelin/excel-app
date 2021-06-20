import { dom } from '@core/dom'

export class Excel {
	constructor(selector, options) {
		this.$el = dom(selector)
		this.selector = selector
		this.components = options.components || []
	}
	getRoot() {
		const $root = dom.create('div', 'excel')
		this.components = this.components.map(Component => {
			const $componentEl = dom.create('div', Component.className)
			const component = new Component($componentEl)
			// console.log('$el', $componentEl)
			$componentEl.html(component.toHTML())
			$root.append($componentEl)
			return component
		})
		return $root
	}
	render() {
		if (!this.$el) {
			throw new Error(`Элемент с селектором ${this.selector} не найден`)
		}
		this.$el.append(this.getRoot())
		this.components.forEach(component => {
			// eslint-disable-next-line no-prototype-builtins
			component.init()
		})
	}
}
