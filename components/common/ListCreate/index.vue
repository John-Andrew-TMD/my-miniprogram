<template>
	<view class="list-create">
		<view :id="`start${listOptions.index}`" class='start-view'></view>
		<main>
			<template v-if="listOptions.listData.length>0">
				<ul class="app-list list-create u-skeleton u-skeleton-circle u-skeleton-rect u-skeleton-fillet">
					<li v-for="(item,index,key) in listOptions.listData" :key="index">
						<navigator class = "navigator" :url="`/pages/articles/index?id=${item.id}`">
							<view class="list-row">
								<view class="list-content">
									{{item[listOptions.keyList.content]}}
								</view>
							</view>
							<view class="list-row">
								<view class="list-detail">
									{{item[listOptions.keyList.detail]}}
								</view>
								<view class="list-time">
									{{item[listOptions.keyList.timestamp]}}
								</view>
							</view>
						</navigator>
					</li>
				</ul>
				<view v-if = "uEmptyOption.showTip" class="u-tip">
					未找到想要的结果？<br />您可以详细填写您想查找的内容<br/>
					<navigator class = "navigator" url = "">留言/反馈</navigator>
				</view>
				<u-loadmore :is-dot="true" :status="status" :icon-type="iconType" :load-text="loadText" />
			</template>
			<template v-else>
				<view v-if="status=='nomore'">
					<u-empty class="u-empty" :margin-top="uEmptyOption.marginTop" color="#999" text="暂无数据" :mode="uEmptyOption.src?'data':'list'"
					 :text="uEmptyOption.text" :icon-size="uEmptyOption.iconSize" :src="uEmptyOption.src">
					</u-empty>
					<view style = "margin-top:-20rpx" v-if = "uEmptyOption.showTip" class="u-tip">
						未找到想要的结果？<br />您可以详细填写您想查找的内容<br/>
						<navigator class = "navigator" url = "">留言/反馈</navigator>
					</view>
				</view>
				<view v-else>
					<u-loadmore :is-dot="true" :status="status" :icon-type="iconType" :load-text="loadText" />
				</view>
			</template>
		</main>

		<view :id="`end${listOptions.index}`" class='end-view'></view>
	</view>

</template>

<script>
	export default {
		inheritAttrs: false,
		props: {
			uEmptyOption: {
				type: Object,
				default () {
					return {}
				}
			},
			status: {
				type: String,
				default () {
					return "nomore"
				}
			},
			options: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		watch: {
			options: {
				handler(val, oldval) {
					this.listOptions = Object.assign(this.listOptions, val)
					this.$nextTick(() => {
						this.autoHeight()
					})
				},
				deep: true,
				immediate: true
			}
		},
		data() {
			return {
				iconType: 'circle',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中',
					nomore: '暂无数据'
				},
				loading: true,
				swiperHeight: 0,
				listOptions: {
					listData: [],
					index: 0,
					keyList: {
						content: "content",
						detail: "detail",
						timestamp: "timestamp"
					}
				}
			};
		},
		computed: {

		},
		created() {},
		methods: {
			autoHeight() {
				let isIndex = this.listOptions.index;
				uni.createSelectorQuery().in(this)
					.select('#end' + isIndex).boundingClientRect()
					.select('#start' + isIndex).boundingClientRect().exec(rect => {
						let _space = rect[0].top - rect[1].top;
						_space = _space + 'px';
						this.swiperHeight = _space
						this.loading = false
						this.$emit("update:swiper-height", _space)
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-create {
		.u-tip {
			display: table;
			margin: 0 auto;
			text-align: center !important;
			line-height: 1.5 !important;
			font-size: 28upx;
			font-weight: 400;
			color: #999999;
			margin-bottom: 70upx;
			.navigator{
				color: #4F79F5;
			}
		}
	}
	.app-list {
		padding: 0 30upx;
		background-color: #fff;
		overflow: hidden;

		&>li {
			overflow: hidden;
			border-bottom: 1px solid #EEEEEE;
		}

		.list-content {
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			width: 100%;
			line-height: 40upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			overflow: hidden;
			/*! autoprefixer: off */
			-webkit-box-orient: vertical;
		}
		.navigator{
			display: block;
			width: 100%;
			height: 100%;
		}
		.list-row {
			display: flex;
			justify-content: center;
			margin-top: 20upx;

			.list-time {
				margin-left: auto;
				padding-left: 20upx;
				white-space: nowrap;
			}

			.list-detail,
			.list-time {
				font-size: 24upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #AAAAAA;
				line-height: 34upx;
			}
		}

		.list-row:last-child {
			margin-bottom: 30upx;
		}

	}
</style>
