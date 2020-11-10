
<script>
	import {AppModel} from './models/app.js'
	const appModel = new AppModel()
	export default {
		onShow: function() {
			this.getLogin()
		},
		methods:{
			getLogin(){
				// uni.login({
				// 	success(res) {
				// 		if(res.code){
				// 			appModel.login({code:res.code}).then(response=>{
				// 				this.$store.dispatch('setUserInfo',response.data)
				// 				uni.setStorageSync('AuthTokens',response.data.token)
				// 				uni.login({
				// 					success(response){
				// 						uni.setStorageSync('wxCode',response.code)
				// 					}
				// 				})
				// 			}).catch(errors=>{
				// 				// console.error(errors)
				// 			})
				// 		}
				// 	},
				// 	fail(err){
				// 		uni.showToast({
				// 			title:'微信登陆失败',
				// 			icon:'none'
				// 		})
				// 	}
				// })
			}
		}
	}
</script>
<style  lang="scss">
	@import "uview-ui/index.scss";
	@import "common/demo.scss";
</style>

