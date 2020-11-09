<template>
	<view class="app-content">
		<u-sticky>
			<u-tabs-swiper swiperWidth="750" ref="uTabs" font-size="28" :active-item-style="{ 'fontSize': '36rpx' }" active-color="#FF5948"
			 inactive-color="#999999" :list="list" :current="current" @change="tabsChange">
			</u-tabs-swiper>
		</u-sticky>
		<swiper  :style="{'height':swiperHeight}" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<list-create :status="status" :swiper-height.sync="swiperHeight" v-if="index==current" :key="index" :ref="`listCreate${index}`"
				 :options="tableOptions"></list-create>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import ListCreate from "@/components/common/ListCreate"
	import {
		IndexModel
	} from '@/models/index.js'
	const indexModel = new IndexModel()
	export default {
		props: {
			options: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		components: {
			ListCreate
		},
		data() {
			return {
				status: 'loading',
				swiperHeight: '0px',
				list: [{
					name: '法规',
					secondaryCategory: 'A'
				}, {
					name: '行政法规',
					secondaryCategory: 'B'
				}, {
					name: '地方性法规',
					secondaryCategory: 'C'
				}, {
					name: '规章',
					secondaryCategory: 'D'
				}, {
					name: '规范性文件',
					secondaryCategory: 'E'
				}, {
					name: '通知公示',
					secondaryCategory: 'F'
				}],
				swiperCurrent: 0,
				current: 0,
				pages: 1,
				tableOptions: {
					listData: []
				},
				listParams: {}
			};
		},
		mounted() {
			setTimeout(() => {
				this.tabsChange(0)
			}, 0)
		},
		methods: {
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				if(e.detail.source=="touch"){
					 this.tabsChange(current)
				}
			},
			onreachBottom() {
				if (this.listParams.pageNo >= this.pages) {
					this.status = "nomore"
					return;
				}
				this.listParams.pageNo++
				this.getListData(this.listParams)
			},
			onpullDownRefresh(){
				this.tabsChange(this.current)
			},
			getListData(params) {
				this.status = "loading"
				indexModel.getSearchLawLib(params).then(res => {
						let listData = res.data && res.data.result && res.data.result.records
						this.pages = res.data.result.pages
						let tableOptions = {
							listData: (this.listParams.pageNo == 1) ? listData : this.tableOptions.listData.concat(listData),
							index: this.swiperCurrent,
							keyList: {
								content: "title",
								detail: "licence",
								timestamp: "updateTime"
							}
						}
						this.tableOptions = Object.assign(this.tableOptions, tableOptions)
						this.$set(this.tableOptions, 0, tableOptions)
						if (this.listParams.pageNo >= this.pages) {
							this.status = "nomore"
						} else {
							this.status = "loadmore"
						}
						this.$store.commit('SET_SEARCHID',res.data.searchId)
						uni.stopPullDownRefresh()
					})
					.catch(err => {
						this.status = "loadmore"
						uni.stopPullDownRefresh()
					})
			},
			tabsChange(index) {
				this.listParams = {
					condition: {
						queryString: "",
						searchScope: {
							category: ["A900"],
							secondaryCategory: [this.list[index].secondaryCategory]
						}
					},
					pageNo: 1,
					pageSize: 10
				}
				this.swiperCurrent = index;
				this.getListData(this.listParams)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-content {
		// height: 100%;
	}
</style>
