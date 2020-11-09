const home = {
	state: {
		searchId: '',
		listParams : {
			condition: {
				queryString: "",
				searchScope: {
					category: ["A900"],
					secondaryCategory: []
				}
			},
			pageNo: 1,
			pageSize: 10
		}
	},
	mutations: {
		SET_SEARCHID(state,searchId){
			state.searchId = searchId
		},
		SET_LISTPARAMS(state,listParams){
			state.listParams = listParams
		},
		SET_PAGENOADD(state){
			state.pageNo++
		},
		RESET_LISTPARAMS(state){
			state.listParams =  {
				condition: {
					queryString: "",
					searchScope: {
						category: ["A900"],
						secondaryCategory: []
					}
				},
				pageNo: 1,
				pageSize: 10
			}
		}
	},
	actions: {},
	getters: {}
}

export default home
