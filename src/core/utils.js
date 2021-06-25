export function capitalize(prefix = 'on', string) {
	if (typeof string !== 'string') {
		return ''
	}
	let pref = ''
	if (prefix) pref = prefix
	return pref + string.charAt(0).toUpperCase() + string.slice(1)
}

export function range(start, end) {
	if (start > end) {
		[end, start] = [start, end]
	}
	return new Array(end - start + 1)
		.fill('')
		.map((_, index) => start + index)
}

export function matrix($target, $current) {
	const target = $target.id(true)
	const current = $current.id(true)

	const cols = range(current.col, target.col)
	const rows = range(current.row, target.row)

	return cols.reduce((acc, col) => {
		rows.forEach(row => acc.push(`${row}:${col}`))
		return acc
	}, [])
}

export function nextSelector(key, {col, row}) {
	switch (key) {
	case 'Enter':
	case 'ArrowDown':
		row++
		break
	case 'ArrowLeft':
		col--
		break
	case 'Tab':
	case 'ArrowRight':
		col++
		break
	case 'ArrowUp':
		row--
		break
	}

	return `[data-cell-id="${row}:${col}"]`
}

export function storage(key, data = null) {
	if (!data) {
		return JSON.parse(localStorage.getItem(key))
	}
	localStorage.setItem(key, JSON.stringify(data))
}

export function isEqual(a, b) {
	if (typeof a === 'object' && typeof b === 'object') {
		return JSON.stringify(a) === JSON.stringify(b)
	}
	return a === b
}

export function camelToDashCase(str) {
	return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}

export function toInlineStyles(styles = {}) {
	return Object.keys(styles)
		.map(key => `${camelToDashCase(key)}: ${styles[key]}`)
		.join(';')
}

export function debounce(fn, wait) {
	let timeout
	return function(...args) {
		const later = () => {
			clearTimeout(timeout)
			// eslint-disable-next-line no-invalid-this
			fn.apply(this, args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}
