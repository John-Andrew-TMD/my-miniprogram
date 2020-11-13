<template>
	<view class="app-content ">
		<view v-if="showFindBar" class="app-layout">
			<view class="app-search">
				<mSearch ref="mSearch" class="mSearch-input-box" :mode="2" :findPage="true" :placeholder="defaultKeyword" @search="doSearch(false)"
				 @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
			</view>
			<u-icon class="u-icon" name="arrow-up" size="35" color="#CCCCCC"></u-icon>
			<u-icon class="u-icon" name="arrow-down" size="35" color="#CCCCCC"></u-icon>
			<u-icon class="u-icon" name="close-circle-fill" size="35" color="#CCCCCC" @click.stop="handleClearClick"></u-icon>
		</view>
		<view ref="detailContent" class="u-skeleton" id="detailContent">
			<view class="app-title">
				{{ info.title || '' }}
				<view class="app-detail">
					{{ info.category || '' }}
					<view @click="show = true" class="app-picker">
						{{langageVal}}
						<u-icon name="arrow-down-fill" color="#4F79F5" size="14"></u-icon>
					</view>
				</view>
			</view>
			<view class="app-list ">
				<template v-for="(item, key) in infoTip">
					<template v-if="key=='taxTags'">
						<view class="list-row" v-if="item.length" :key="key">
							<view class="list-label"> {{ tipLabel[key] }}: </view>
							<view class="list-content">
								{{ item.map((el)=>el.name).join('/')}}
							</view>
						</view>
					</template>
					<template v-else>
						<view class="list-row" v-if="item" :key="key">
							<view class="list-label"> {{ tipLabel[key] }}: </view>
							<view class="list-content">
								{{ item}}
							</view>
						</view>
					</template>
				</template>
			</view>
			<view class="u-parse">
				<u-parse class="bulletin" :html="info.content"></u-parse>
			</view>
			<view class="app-attachment " v-if="info.attaches&&info.attaches.length">
				<view class="attachment-title">
					<image class="u-icon" mode="aspectFit" :src="attachTitle"></image>
					附件
				</view>
				<template v-for="(item, index) in attachment">
					<view class="attachment-list" :key="index" @click="handleViewClick(item)">
						<image class="u-icon" mode="aspectFit" :src="getAttachIcon(item.attachSuffix)"></image>
						{{ item.attachName }}
					</view>
				</template>

				<view class="attachment-list attachment-all" @click="handleDisplayAll()">
					{{expand?'收起':'显示全部'}}
				</view>
			</view>
			<!-- <image @click="showFindBar=true" class="app-zhiding" src="/static/images/find.png" mode="aspectFit"></image> -->
			<u-picker @confirm="getPickerValue" mode="selector" v-model="show" :range="langage" default-selector="[0]"></u-picker>
		</view>
		<u-skeleton :loading="loading" el-color="#ddd" bg-color="#fff"></u-skeleton>
	</view>
</template>

<script>
	import {
		ArticleModel
	} from '@/models/article.js';
	const articleModel = new ArticleModel();
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	import {
		highlightKeyword,
		searchHighlightKeyword
	} from "utils/hl.js";
	export default {
		components: {
			mSearch
		},
		data() {
			return {
				showFindBar: false,
				keyword: "",
				defaultKeyword: "文章内搜索",
				expand: false,
				loading: true, // 是否显示骨架屏组件
				show: false,
				langage: ['中文版', '英文简版'],
				langageVal: '中文版',
				info: '',
				infoTip: {},
				maxCount: 5,
				attachTitle: require('static/images/attach/icon@2x(5).png'),
				attachIcon: {
					pdf: require('static/images/attach/pdf.png'),
					doc: require('static/images/attach/doc.png'),
					other: require('static/images/attach/other.png'),
					rar: require('static/images/attach/rar.png'),
					xls: require('static/images/attach/xls.png'),
				},
				tipLabel: {
					licence: '发文机关',
					recordArticleTime: '成交日期',
					effectiveDate: '生效日期',
					validity: '有效性',
					taxTags: '税种',
					reference: '文号',
					keywords: '关键词',
					repealed: '修订',
				},
			};
		},
		computed: {
			attachment() {
				let attach = this.info.attaches &&
					this.info.attaches.slice(0, this.maxCount)
				return attach
			}
		},
		onLoad: function(options) {
			this.init(options);
		},
		methods: {
			inputChange(e) {
				let bodyChildren = uni
					.createSelectorQuery()
					.in(this)
					.select("#detailContent");
				if (!this.keyword.trim()) return;
				let transform = this.keyword.replace(/[.[*?+^$|()/]|\]|\\/g, "\\$&");
				let pattern1 = new RegExp(transform, "i");
				searchHighlightKeyword(bodyChildren, pattern1, true);
			},
			handleClearClick() {
				this.$refs.mSearch.clear()
				this.showFindBar = false
			},
			handleDisplayAll() {
				this.expand = !this.expand
				this.maxCount = this.expand ? this.info.attaches.length : 5
			},
			getPickerValue(val) {
				this.langageVal = this.langage[val]
			},
			// getListItem(item,key){
			// 	if(key=='taxTags'){

			// 	}else{
			// 		return item
			// 	}
			// },
			getAttachIcon(attachSuffix) {
				if (this.attachIcon[attachSuffix]) {
					return this.attachIcon[attachSuffix];
				} else {
					return this.attachIcon.other;
				}
			},
			handleViewClick(item) {
				uni.downloadFile({
					url: item.attachUrl,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							fileType: item.attachSuffix,
							success: function(res) {}
						});
					}
				});
			},
			handleFindClick() {},
			init(options) {
				articleModel.articleById(options).then((res) => {
					this.info = res.data;
					this.loading = false;
					let {
						licence,
						recordArticleTime,
						effectiveDate,
						validity,
						taxTags,
						reference,
						keywords,
						repealed,
					} = res.data;
					this.infoTip = {
						licence,
						recordArticleTime,
						effectiveDate,
						validity,
						taxTags,
						reference,
						keywords,
						repealed,
					};
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.app-content {
		width: 100%;
		padding: 30rpx 40rpx;
		background-color: #fff;

		.u-parse {
			padding-top: 30rpx;
		}

		.app-title {
			font-size: 36rpx;
			font-weight: 600;
			color: #333333;
			line-height: 50rpx;
			border-bottom: 1px solid #dddddd;

			.app-detail {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
				display: flex;
				padding: 30rpx 0;

				.app-picker {
					font-size: 24rpx;
					font-weight: 400;
					color: #4f79f5;
					margin-left: auto;
				}
			}
		}

		.app-layout {
			position: fixed;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 20rpx 30rpx;
			width: 100%;
			border-bottom: 1px solid #ddd;
			background-color: #fff;

			.app-search {
				flex: 1;
			}

			.u-icon {
				margin-left: 20rpx;
			}
		}

		.app-attachment {
			width: 100%;
			background: #f5f5f5;
			border-radius: 4px;
			padding: 0 30rpx;

			.u-icon {
				width: 44rpx;
				height: 44rpx;
				margin-right: 10rpx;
			}

			.attachment-title {
				font-size: 28rpx;
				color: #999999;
				height: 84rpx;
				line-height: 44rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}

			.attachment-all {
				display: flex;
				color: #ff5948;
				justify-content: center !important;
				align-items: center;
			}

			.attachment-list {
				width: 100%;
				font-size: 28rpx;
				font-weight: 400;
				height: 102rpx;
				color: #333333;
				line-height: 44rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 1px soild #ddd;
				cursor: pointer;
			}
		}

		
	}
</style>
