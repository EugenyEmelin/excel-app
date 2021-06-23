import { $ } from '@core/dom'

export function resizeHandler($root, event) {
	const $resizer = $(event.target)

	const $resizableEl = $resizer.closest('[data-type="resizable"]')
	const $coords = $resizableEl.getCoordinates()
	const type = $resizer.dataset.resizer
	let value

	$resizer.css({
		opacity: 1,
		minHeight: type === 'column' ? '100vh' : 'auto',
		minWidth: type === 'row' ? '100vw' : 'auto',
	})

	document.onmousemove = e => {
		if (type === 'column') {
			const xDelta = Math.floor(e.pageX - $coords.right)
			value = ($coords.width + xDelta) + 'px'
			$resizer.css({
				right: -xDelta + 'px'
			})
		} else {
			const yDelta = e.clientY - $coords.bottom
			value = ($coords.height + yDelta) + 'px'
			$resizer.css({
				bottom: -yDelta + 'px'
			})
		}
	}
	document.onmouseup = () => {
		document.onmousemove = null
		document.onmouseup = null

		if (type === 'column') {
			$resizableEl.css({width: value})
			$root
				.findAll(`[data-col-index="${$resizableEl.dataset.colIndex}"]`)
				.forEach(el => el.style.width = value)
		} else {
			$resizableEl.css({
				height: value
			})
		}

		$resizer.css({
			opacity: 0,
			bottom: 0,
			right: '-2px',
			minWidth: 'auto',
			minHeight: 'auto'
		})
	}
}
