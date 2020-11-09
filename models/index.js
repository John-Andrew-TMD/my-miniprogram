import { HTTP } from '../utils/http.js'

class IndexModel extends HTTP {
	getSearchLawLib(params) {
	    return this.request({
	        url: `/v2/search/lawLib`,
			method: 'POST',
			data: params
	    })
	}
}

export { IndexModel }