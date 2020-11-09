import { HTTP } from '../utils/http.js'

class AppModel extends HTTP {
	login(params) {
        return this.request({
            url: `/auth/login`,
			method: 'POST',
			data: params
        })
    }
	filterlist(params,searchId){
		return this.request({
		    url: `/search/filterdata`,
			method: 'POST',
			data: params
		})
	}
}

export { AppModel }