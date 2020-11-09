<template>
	<view class="index-app-content app-content">
		<view class="app-title">
			答税 - 法规库
		</view>
		<u-search @click.native = "handleSearchClick" :disabled="true" class="u-search" placeholder="搜索" clearabled="true" shape="square" v-model="keyword"></u-search>
		<comp-hot></comp-hot>
		<comp-list ref = "compList" class="comp-list"></comp-list>
	</view>
</template>

<script>
	import CompHot from "@/components/index/CompHot.vue"
	import CompList from "@/components/index/CompList.vue"
	export default {
		components: {
			CompHot,
			CompList
		},
		data() {
			return {
				keyword: ""
			}
		},
		onPageScroll(res) {
			//获取距离顶部距离
			const scrollTop = res.scrollTop;
			// 获取屏幕宽高
			const {
				windowWidth,
				windowHeight,
				statusBarHeight
			} = uni.getSystemInfoSync();
			if (scrollTop > 0) {
				uni.setNavigationBarTitle({
				    title: '答税 - 法规库'
				});
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#fff',
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			}else{
				uni.setNavigationBarTitle({
				    title: ''
				});
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#FF5948',
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			}
		
		},
		onPullDownRefresh(){
			this.$refs.compList.onpullDownRefresh()
		},
		onReachBottom(){
			this.$refs.compList.onreachBottom()
		},
		onLoad() {},
		methods: {
			handleSearchClick(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
		}
	}
</script>
<style>
	.index-app-content>* {
		min-width: 92%;
	}
</style>
<style lang="scss" scoped>
	/deep/ .comp-list {
		width: 100%;
		flex: 1;
		margin-top: 20upx;
	}

	.u-search {
		width: 80%;
		margin-top: 20upx;

		/deep/ .u-action {
			display: none;
		}
	}

	.app-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background: linear-gradient(#FF5948 0%, #FF5948 27%, #FFFFFF 38%, #FFFFFF 100%);
	}

	.app-content>* {
		min-width: 80%;
	}

	.app-title {
		font-size: 30px;
		color: #fff;
		padding-top: 40upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
