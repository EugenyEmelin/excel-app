import { storage } from '@core/utils'
import { defaultStyles } from '@/constants'

export const defaultState = {
	title: 'Новая таблица',
	rowState: {},
	colState: {},
	dataState: {},
	stylesState: {},
	currentText: '',
	currentStyles: defaultStyles
}

const normalize = state => ({
	...state,
	currentStyles: defaultStyles,
	currentText: ''
})

export const initialState = storage('excel-state') ?
	normalize(storage('excel-state')) :
	defaultState
