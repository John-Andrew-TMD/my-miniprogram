import { HTTP } from '../utils/http.js'

class SearchModel extends HTTP {
	
	// 兑换记录查询
	searchGlobal(params) {
	    return this.request({
	        url: `/v2/search/global`,
			method: 'POST',
			data: {
				...params
			}
	    })
	}
}

export { SearchModel }