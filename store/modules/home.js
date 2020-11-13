const home = {
	state: {
		searchId: '',
		filterData:[],
		listParams : {
			condition: {
				queryString: "",
				searchScope: {
				}
			},
			pageNo: 1,
			pageSize: 10
		}
	},
	mutations: {
		SET_FILTYERDATA(state,filterData){
			state.filterData = filterData
		},
		SET_SEARCHID(state,searchId){
			state.searchId = searchId
		},
		SET_LISTKEYWORD(state,queryString){
			state.listParams.condition.queryString = queryString
		},
		SET_LISTPARAMS(state,listParams){
			state.listParams = listParams
		},
		SET_LISTPARAMSCOPE(state,searchScope){
			let stateSearchScope = state.listParams.condition.searchScope
			state.listParams.condition.searchScope = Object.assign(stateSearchScope,searchScope)
		},
		SET_PAGENOADD(state){
			state.listParams.pageNo++
		},
		RESET_PAGENOADD(state){
			state.listParams.pageNo = 1
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
