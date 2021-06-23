import { $ } from '@core/dom'
import { Emitter } from '@core/Emitter'

export class Excel {
	constructor(selector, options) {
		this.$el = $(selector)
		this.selector = selector
		this.components = options.components || []
		this.emitter = new Emitter()
	}
	getRoot() {
		const $root = $.create('div', 'excel')
		const componentOptions = {
			emitter: this.emitter
		}
		this.components = this.components.map(Component => {
			const $componentEl = $.create('div', Component.className)
			const component = new Component($componentEl, componentOptions)
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
			component.init()
		})
	}
	destroy() {
		this.components.forEach((component => component.destroy()))
	}
}
