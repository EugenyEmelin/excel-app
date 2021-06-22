class Dom {
	constructor(selector) {
		// console.log('selector', selector)
		let $el
		if (typeof selector === 'string') {
			$el = document.querySelector(selector)
		} else {
			$el = selector
		}
		this.$el = $el
	}
	html(html) {
		if (typeof html === 'string') {
			this.$el.innerHTML = html
			return this
		}
		return this.$el.outerHTML.trim()
	}
	clear() {
		this.html('')
		return this
	}
	onEvent(eventType, callback) {
		this.$el.addEventListener(eventType, callback())
	}
	off(eventType, callback) {
		this.$el.removeEventListener(eventType, callback())
	}
	append(node) {
		// console.log('node', node)
		if (node instanceof Dom) {
			node = node.$el
		}
		if (Element.prototype.append) {
			this.$el.append(node)
		} else {
			this.$el.appendChild(node)
		}
		return this
	}
	get dataset() {
		return this.$el.dataset
	}
	closest(selector) {
		return dom(this.$el.closest(selector))
	}
	getCoordinates() {
		return this.$el.getBoundingClientRect()
	}
	findAll(selector) {
		return this.$el.querySelectorAll(selector)
	}
	css(styles = {}) {
		const stylesArr = Object.entries(styles)
		stylesArr.forEach(([attr, style]) => {
			this.$el.style[attr] = style
		})
	}
}

export function dom(selector) {
	return new Dom(selector)
}

dom.create = (tagName, classes = '') => {
	const el = document.createElement(tagName)
	if (classes.length > 0) {
		el.classList.add(classes)
	}
	return dom(el)
}
