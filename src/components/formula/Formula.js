import { ExcelComponent } from '@core/ExcelComponent'
import { $ } from '@core/dom'

export class Formula extends ExcelComponent {
	static className = 'excel__formula'
	constructor($root, options) {
		super($root, {
			name: 'Formula',
			listeners: ['input', 'click', 'keydown'],
			subscribe: ['currentText'],
			...options
		})
	}

	toHTML() {
		return `
			<div class="info">fx</div>
      <div
        id="formula-input"
        class="input"
        contenteditable
        spellcheck="false"
      ></div>
		`
	}
	init() {
		super.init()
		this.$formula = this.$root.findOne('#formula-input')
		this.$on('table:select', $cell => {
			this.$formula.text($cell.dataset.value)
		})
	}
	storeChanged({currentText}) {
		this.$formula.text(currentText)
	}

	onInput(event) {
		// console.log('event.target', event.target)
		this.$emit('formula:input', $(event.target).text())
	}
	onKeydown(event) {
		const keys = ['Enter', 'Tab']
		if (keys.includes(event.key)) {
			event.preventDefault()
			this.$emit('formula:enter')
		}
	}
	onClick() {}
}
