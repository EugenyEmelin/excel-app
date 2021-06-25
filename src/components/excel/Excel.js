import { $ } from '@core/dom'
import { Emitter } from '@core/Emitter'
import { StoreSubscriber } from '@core/StoreSubscriber'

export class Excel {
	constructor(selector, options) {
		this.$el = $(selector)
		this.selector = selector
		this.components = options.components || []
		this.store = options.store
		this.emitter = new Emitter()
		this.subscriber = new StoreSubscriber(this.store)
	}
	getRoot() {
		const $root = $.create('div', 'excel')
		const componentOptions = {
			emitter: this.emitter,
			store: this.store
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
		this.subscriber.subscribeComponents(this.components)
		this.components.forEach(component => {
			return component.init()
		})
	}
	destroy() {
		this.subscriber.unsubscribeFromStore()
		this.components.forEach((component => component.destroy()))
	}
}
