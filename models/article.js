import { HTTP } from '../utils/http.js'

class ArticleModel extends HTTP {
	articleById(options){
		return this.request({
		    url: `/cms/h5/article/${options.id}`,
			method: 'GET'
		})
	}
}

export { ArticleModel }