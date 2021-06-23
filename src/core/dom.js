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
		return $(this.$el.closest(selector))
	}
	getCoordinates() {
		return this.$el.getBoundingClientRect()
	}
	addClass(className) {
		this.$el.classList.add(className)
		return this
	}
	removeClass(className) {
		this.$el.classList.remove(className)
		return this
	}
	id(parse) {
		if (parse) {
			const parsed = this.id().split(':')
			return {
				row: +parsed[0],
				col: +parsed[1]
			}
		}
		return this.dataset.cellId
	}
	findOne(selector) {
		return $(this.$el.querySelector(selector))
	}
	findAll(selector) {
		return this.$el.querySelectorAll(selector)
	}
	focus() {
		this.$el.focus()
		return this
	}
	text(text) {
		if (!this.$el) return
		if (typeof text === 'string') {
			this.$el.textContent = text
			return this
		}
		if (this.$el.tagName.toLowerCase() === 'input') {
			return this.$el.value.trim()
		}
		return this.$el.textContent.trim()
	}
	css(styles = {}) {
		const stylesArr = Object.entries(styles)
		stylesArr.forEach(([attr, style]) => {
			this.$el.style[attr] = style
		})
	}
}

export function $(selector) {
	return new Dom(selector)
}

$.create = (tagName, classes = '') => {
	const el = document.createElement(tagName)
	if (classes.length > 0) {
		el.classList.add(classes)
	}
	return $(el)
}
