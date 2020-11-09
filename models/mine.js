import { HTTP } from '../utils/http.js'

class MineModel extends HTTP {
	
	// 兑换记录查询
	exchangeRecordList(params) {
	    return this.request({
	        url: `/exchange_record_list`,
			method: 'POST',
			data: {
				...params
			}
	    })
	}
}

export { MineModel }