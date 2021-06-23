export function shouldResize(event) {
	return event.target.dataset.resizer
}
export function isCell(event) {
	return event.target.dataset.type === 'cell'
}
