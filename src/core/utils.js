export function capitalize(prefix = 'on', string) {
	if (typeof string !== 'string') {
		return ''
	}
	let pref = ''
	if (prefix) pref = prefix
	return pref + string.charAt(0).toUpperCase() + string.slice(1)
}
