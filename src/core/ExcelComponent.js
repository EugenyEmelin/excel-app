import { DomListener } from '@core/DomListener'

export class ExcelComponent extends DomListener {
	constructor($root, options = {}) {
		super($root, options.listeners)
		this.name = options.name || ''
		this.emitter = options.emitter
		this.unsubscribers = []
		this.subscribe = options.subscribe || []
		this.store = options.store

		this.prepare()
	}
	// Настройка до инициализации
	prepare() {}

	toHTML() {
		return ''
	}
	// Уведомляем слушателей про событие event
	$emit(event, ...args) {
		this.emitter.emit(event, ...args)
	}
	// Подписываемся на событие event
	$on(event, fn) {
		const unsub = this.emitter.subscribe(event, fn)
		this.unsubscribers.push(unsub)
	}
	isWatching(key) {
		return this.subscribe.includes(key)
	}
	$dispatch(action) {
		this.store.dispatch(action)
	}
	storeChanged() {

	}
	init() {
		this.initDOMListeners()
	}
	destroy() {
		this.removeDOMListeners()
		this.unsubscribers.forEach(unsub => unsub())
	}
}
