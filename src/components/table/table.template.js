const CODES = {
	A: 65,
	Z: 90
}
function toCell(rowIndex) {
	return function(_, colIndex) {
		return `
			<div 
				class="cell" 
				contenteditable 
				data-col-index="${colIndex}"
				data-cell-id="${rowIndex}:${colIndex}"
				data-type="cell"
			></div>
		`
	}
}
function toColumn(col, colIndex) {
	return `
		<div class="column" data-type="resizable" data-col-index="${colIndex}">
			${col}
			<div class="col-resize" data-resizer="column"></div>
		</div>
	`
}
function createRow(rowIndex, content) {
	const resizer = rowIndex ?
		'<div class="row-resize" data-resizer="row"></div>' :
		''

	return `
		<div class="row" data-type="resizable">
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

export function createTable(rowsCount = 45) {
	const colsCount = CODES.Z - CODES.A + 1
	const rows = []
	const cols = new Array(colsCount)
		.fill('')
		.map(toChar)
		.map(toColumn)
		.join('')

	rows.push(createRow(null, cols))

	for (let row = 0; row < rowsCount; row++) {
		const cells = new Array(colsCount)
			.fill('')
			.map(toCell(row))
			.join('')

		rows.push(createRow(row + 1, cells))
	}
	return rows.join('')
}

