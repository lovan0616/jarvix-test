import { getDatetimePatterns } from '@/API/File'

export default {
	getDatetimePatterns ({ commit, state }) {
		if (state.datetimePatterns.length > 0 ) return
		return getDatetimePatterns().then(res => {
			commit('updateDatetimePatterns', res)
		})
	}
}
