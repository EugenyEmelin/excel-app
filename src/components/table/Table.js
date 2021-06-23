import { ExcelComponent } from '@core/ExcelComponent'
import { createTable } from '@/components/table/table.template'
import { resizeHandler } from '@/components/table/table.resize'
import { isCell, shouldResize } from '@/components/table/table.functions'
import { TableSelection } from '@/components/table/TableSelection'
import { $ } from '@core/dom'
import { matrix, nextSelector } from '@core/utils'

export class Table extends ExcelComponent {
	static className = 'excel__table'
	constructor($root, options) {
		super($root, {
			name: 'Table',
			listeners: ['mousedown', 'keydown', 'input'],
			...options
		})
	}
	toHTML() {
		return createTable()
	}
	prepare() {
		this.selection = new TableSelection()
	}
	selectCell($cell) {
		this.selection.select($cell)
		this.$emit('table:select', $cell)
	}

	init() {
		super.init()
		const $cell = this.$root.findOne('[data-cell-id="0:0"]')
		this.selectCell($cell)
		this.$on('formula:input', text => {
			this.selection.currentCell.text(text)
		})
		this.$on('formula:enter', () => {
			this.selection.currentCell.focus()
		})
	}
	onMousedown(event) {
		if (shouldResize(event)) {
			resizeHandler(this.$root, event)
		} else if (isCell(event)) {
			const $target = $(event.target)
			this.$emit('table:select', $target)
			if (event.shiftKey) {
				const $cells = matrix($target, this.selection.currentCell)
					.map(id => this.$root.findOne(`[data-cell-id="${id}"]`))

				this.selection.selectGroup($cells)
			} else {
				this.selection.select($target)
			}
		}
	}
	onKeydown(event) {
		const keys = [
			'Enter',
			'Tab',
			'ArrowLeft',
			'ArrowRight',
			'ArrowUp',
			'ArrowDown'
		]
		const {key} = event

		if (
			keys.includes(key) &&
			!event.shiftKey &&
			!event.ctrlKey
		) {
			event.preventDefault()
			const currentCellId = this.selection.currentCell.id(true)
			const $next = this.$root.findOne(nextSelector(key, currentCellId))
			this.selectCell($next)
		}
	}
	onInput(event) {
		this.$emit('table:input', $(event.target))
	}
}
