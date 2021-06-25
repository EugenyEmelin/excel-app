import { toInlineStyles } from '@core/utils'
import { defaultStyles } from '@/constants'
import { parse } from '@core/parse'

const CODES = {
	A: 65,
	Z: 90
}
const DEFAULT_WIDTH = '120px'
const DEFAULT_HEIGHT = '24px'

function toCell(state, rowIndex) {
	return function(_, colIndex) {
		const id = `${rowIndex}:${colIndex}`
		const width = getColWidth(state.colState, colIndex)
		const data = state.dataState[id]
		const styles = toInlineStyles({
			...defaultStyles,
			...state.stylesState[id]
		})

		return `
			<div 
				class="cell" 
				contenteditable 
				data-col-index="${colIndex}"
				data-cell-id="${id}"
				data-type="cell"
				data-value="${data || ''}"
				style="${styles}; width: ${width}"
			>${parse(data) || ''}</div>
		`
	}
}
function toColumn({col, colIndex, width}) {
	return `
		<div
			class="column"
			data-type="resizable"
			data-col-index="${colIndex}"
			style="width: ${width}"
		>
			${col}
			<div class="col-resize" data-resizer="column"></div>
		</div>
	`
}
function createRow(rowIndex, content, state) {
	const resizer = rowIndex ?
		'<div class="row-resize" data-resizer="row"></div>' :
		''
	const height = getRowHeight(state, rowIndex)

	return `
		<div
			class="row"
			data-type="resizable"
			data-row-index="${rowIndex}"
			style="height: ${height}"
		>
			<div class="row-info">
				${rowIndex ?? ''}
				${resizer}
			</div>
			<div class="row-data">${content}</div>
		</div>
	`
}

function toChar(_, index) {
	return String.fromCharCode(CODES.A + index)
}

function getColWidth(state, index) {
	return state[index] || DEFAULT_WIDTH
}
function getRowHeight(state, index) {
	return state[index] || DEFAULT_HEIGHT
}

function widthFrom(state) {
	return function(col, index) {
		return {
			col,
			colIndex: index,
			width: getColWidth(state.colState, index)
		}
	}
}

export function createTable(rowsCount = 45, state = {}) {
	const colsCount = CODES.Z - CODES.A + 1
	const rows = []
	const cols = new Array(colsCount)
		.fill('')
		.map(toChar)
		.map(widthFrom(state))
		.map(toColumn)
		.join('')

	rows.push(createRow(null, cols, {}))

	for (let row = 0; row < rowsCount; row++) {
		const cells = new Array(colsCount)
			.fill('')
			.map(toCell(state, row))
			.join('')

		rows.push(createRow(row + 1, cells, state.rowState))
	}
	return rows.join('')
}

