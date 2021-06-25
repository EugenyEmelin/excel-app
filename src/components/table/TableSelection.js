export class TableSelection {
	static className = 'selected'
	constructor() {
		this.group = []
		this.currentCell = null
	}
	select($el) {
		if ($el.$el) {
			this.clearSelect()
			this.group.push($el)
			this.currentCell = $el
			$el.focus().addClass(TableSelection.className)
		}
	}
	clearSelect() {
		this.group.forEach(cell => cell.removeClass(TableSelection.className))
		this.group = []
	}
	get selectedIds() {
		return this.group.map($el => $el.id())
	}
	selectGroup($group = []) {
		this.clearSelect()
		this.group = $group
		this.group.forEach($el => $el.addClass(TableSelection.className))
	}
	applyStyle(style) {
		this.group.forEach($el => $el.css(style))
	}
}
