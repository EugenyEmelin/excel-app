import { ExcelComponent } from '@core/ExcelComponent'
import { createTable } from '@/components/table/table.template'
import { resizeHandler } from '@/components/table/table.resize'
import { isCell, shouldResize } from '@/components/table/table.functions'
import { TableSelection } from '@/components/table/TableSelection'
import { $ } from '@core/dom'
import { matrix, nextSelector } from '@core/utils'
import * as actions from '@/store/actions'
import { defaultStyles } from '@/constants'
import { parse } from '@core/parse'

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
		return createTable(20, this.store.getState())
	}
	prepare() {
		this.selection = new TableSelection()
	}
	selectCell($cell) {
		this.selection.select($cell)
		this.$emit('table:select', $cell)
		const styles = $cell.getStyles(Object.keys(defaultStyles))
		this.$dispatch(actions.changeStyles(styles))
	}

	init() {
		super.init()
		const $cell = this.$root.findOne('[data-cell-id="0:0"]')
		this.selectCell($cell)
		this.$on('formula:input', value => {
			this.selection.currentCell
				.attr('data-value', value)
				.text(parse(value))

			// this.selection.currentCell.text(value)
			this.updateTextInStore(value)
		})
		this.$on('formula:enter', () => {
			this.selection.currentCell.focus()
		})
		this.$on('toolbar:applyStyle', style => {
			this.selection.applyStyle(style)
			this.$dispatch(actions.applyStyle({
				value: style,
				ids: this.selection.selectedIds
			}))
		})
	}

	async resizeTable(event) {
		try {
			const data = await resizeHandler(this.$root, event)
			this.$dispatch(actions.tableResize(data))
		} catch (e) {
			console.warn('Resize Error: ', e.message)
		}
	}

	async onMousedown(event) {
		if (shouldResize(event)) {
			await this.resizeTable(event)
		} else if (isCell(event)) {
			const $target = $(event.target)
			this.$emit('table:select', $target)
			if (event.shiftKey) {
				const $cells = matrix($target, this.selection.currentCell)
					.map(id => this.$root.findOne(`[data-cell-id="${id}"]`))

				this.selection.selectGroup($cells)
			} else {
				this.selectCell($target)
				this.updateTextInStore($target.text())
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
	updateTextInStore(value) {
		this.$dispatch(actions.changeText({
			id: this.selection.currentCell.id(),
			value
		}))
	}
	onInput(event) {
		// this.$emit('table:input', $(event.target))
		console.log('current cell: ', this.selection.currentCell)
		this.updateTextInStore($(event.target).text())
	}
}
