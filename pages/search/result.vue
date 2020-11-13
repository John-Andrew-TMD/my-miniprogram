<template>
	<view class="">
		<my-dropdown v-if="filterData.taxFilterData" @init="init"></my-dropdown>
		<view id="app-tip" class="app-tip">
			<view class="app-tip-title">
				共搜索出 <span style = "color:#FF5948">{{ tableOptions.listData.length }}</span> 条结果
			</view>
			<view class="filter-box app-list">
				<view class="list-row" v-if="urlParams.queryString!==''">
					<view class="list-label">
						关键词:
					</view>
					<view class="list-content">
						<view class="list-item">
							{{listParams.condition.queryString}}
						</view>
					</view>
				</view>
				<template v-for="(item,key) in listParams.condition.searchScope" >
					<view class="list-row" v-if="getShow(item)" :key = "key">
						<view class="list-label">
							{{filterkey[key]}}:
						</view>
						<view class="list-content" v-if= "item.length">
							<view class="list-item" v-for="(el,index) in item" :key = "index">
								<template v-if = "el!='undefined'">
									{{el|filterDictValueBykey(filterTrans[key])}}
								</template>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<scroll-view scroll-y="true" class="main" :style="{ height: `calc(100vh - ${80 + tipHeight}px)` }" @scrolltolower="onreachBottom"
		 :lower-threshold="20" refresher-enabled="true" :refresher-triggered="triggered" :refresher-threshold="100"
		 @refresherrefresh="onpullDownRefresh" @refresherrestore="onRestore">
			<list-create :status="status" :swiper-height.sync="swiperHeight" :options="tableOptions" :uEmptyOption="uEmptyOption"></list-create>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import ListCreate from "@/components/common/ListCreate";
	import MyDropdown from "@/components/search/my-dropdown/";
	import {
		IndexModel
	} from "@/models/index.js";
	import {getTargetData} from "utils"
	const indexModel = new IndexModel();
	import {
		AppModel
	} from "@/models/app.js";

	const appModel = new AppModel();
	export default {
		components: {
			ListCreate,
			MyDropdown
		},
		data() {
			return {
				urlParams:{},
				triggered: false,
				status: "loading",
				swiperHeight: "0px",
				tableOptions: {
					listData: []
				},
				filterkey: {
					category: "文章分类",
					secondaryCategory: "文章二级分类",
					taxTags: "税种",
					level: "层级",
					city: "市",
					district: "省",
					free: "免费(单选)",
					recommend: "推荐(单选)",
					timeCode: "发布时间",
					timeRange: "自定义发布时间范围"
				},
				filterTrans:{
					taxTags: "taxFilterData",
					category:"secondaryCategoryFilterData"
				},
				uEmptyOption: {
					showTip: true,
					marginTop: 240,
					text: " ",
					iconSize: 500,
					src: require("static/images/default-icon.png")
				},
				pages: 1,
				tipHeight: 0,
				filterData: {}
			};
		},
		computed: {
			...mapGetters({
				listParams: 'listParams'
			})
		},
		watch: {
			listParams: {
				handler(val) {
					console.log("爸爸")
				},
				deep: true,
				immediate: true
			}
		},
		onLoad: function(options) {
			this.getFilterlist();
			this.urlParams = options
			this.init();
		},
		methods: {
			getShow(item){
				if(item instanceof Array){
					if(item.length){
						return true
					}else{
						return false
					}
				}else{
					return item
				}
			},
			init() {
				this._freshing = false;
				setTimeout(() => {
					this.triggered = true;
				}, 1000);
				this.$store.commit("SET_LISTKEYWORD", this.urlParams.queryString)
				uni
					.createSelectorQuery()
					.in(this)
					.select("#app-tip")
					.boundingClientRect()
					.exec(rect => {
						this.tipHeight = rect[0].height;
					});
				this.getListData();
			},
			onRestore() {
				this.triggered = "restore"; // 需要重置
			},
			onpullDownRefresh(e) {
				if (this._freshing) return;
				this._freshing = true;
				this.$store.commit("RESET_PAGENOADD")
				this.getListData();
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 1000);
			},
			onreachBottom(e) {
				if (this.listParams.pageNo >= this.pages) {
					this.status = "nomore";
					return;
				}
				this.$store.commit("SET_PAGENOADD")
				this.getListData();
			},
			getListData() {
				this.status = "loading";
				indexModel
					.getSearchLawLib(this.listParams)
					.then(res => {
						let listData = res.data && res.data.result && res.data.result.records;
						this.pages = res.data.result.pages;
						let tableOptions = {
							listData: this.listParams.pageNo == 1 ?
								listData : this.tableOptions.listData.concat(listData),
							index: this.swiperCurrent,
							keyList: {
								content: "title",
								detail: "licence",
								timestamp: "updateTime"
							}
						};
						this.tableOptions = Object.assign(this.tableOptions, tableOptions);
						this.$set(this.tableOptions, 0, tableOptions);
						if (this.listParams.pageNo >= this.pages) {
							this.status = "nomore";
						} else {
							this.status = "loadmore";
						}
						this.$store.commit("SET_SEARCHID", res.data.searchId);
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						this.status = "loadmore";
						uni.stopPullDownRefresh();
					});
			},
			filterTree(list) {
				let ls = []
				list.map(v => {
					let obj = {
						count: v.count,
						code: v.code,
						name: v.name,
						children: []
					}
					if (v.children && v.children.length > 0) {
						v.children.map(v1 => {
							let obj1 = {
								count: v.count,
								code: v1.code,
								name: v1.name,
								children: []
							}
							obj.children.push(obj1)
						})
					}
					ls.push(obj)
				})
				return ls
			},
			getFilterlist() {
				appModel
					.filterlist({
						filterTypeList: ["all"]
					})
					.then(res => {
						this.filterData = res.data
						res.data.taxFilterData.forEach((item, index) => {
							item.label = item.name;
							item.value = item.code;
							item.isChecked = false;
						});
						res.data.regionFilterData.localAreaData.data=this.filterTree(res.data.regionFilterData.localAreaData.data)
						res.data = {
							...res.data,
							sort: [{
									label: "发布时间",
									value: 0
								},
								{
									label: "按匹配度",
									value: 1
								}
							]
						};
						this.$store.commit("SET_FILTYERDATA",res.data)
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.app-tip {
		width: 100%;
		background-color: #fff;
		margin-bottom: 20upx;
		padding: 30upx;
		
		.app-tip-title {
			font-size: 28upx;
			color: #333333;

			span {
				color: #ff5948;
			}
		}
	}
	.app-list {
		border-bottom: none;
		padding-top: 10rpx;
		padding-bottom: 0rpx;
		.list-row {
			.list-label {
				color: #999999!important;
				text-align: left;
			}
			.list-content {
				.list-item{
					display: inline-block;
					background: #F5F5F5;
					border-radius: 22rpx;
					font-size: 24rpx;
					color: #666666;
					padding: 4upx 20upx;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
				}
			}
		}
		.list-row:last-child{
			margin-bottom: -20rpx!important;
		}
	}
</style>
