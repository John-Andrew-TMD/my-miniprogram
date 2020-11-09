<template>
	<view class="app-content">
		<view class="">
			{{info.title}}
			<view class="">
				{{info.category}}
				<view @click="show = true" class="">
					版本：中文版
				</view>
			</view>
		</view>
		<view class="app-list">
			<view class="list-row">
				<view class="list-label">
					
				</view>
				<view class="list-content">
					
				</view>
			</view>
		</view>
		<u-parse class="bulletin" id="detailContent" :html="info.content"></u-parse>
		<u-picker mode="selector" v-model="show" :range="langage" ></u-picker>
	</view>
</template>

<script>
	import {
		ArticleModel
	} from "@/models/article.js";
	const articleModel = new ArticleModel();
	export default {
		data() {
			return {
				show: false,
				langage:['中文版','英文简版'],
				info: "",
				infoTip:{}
			}
		},
		onLoad: function(options) {
			this.init(options)
		},
		methods: {
			init(options) {
				articleModel.articleById(options).then(res => {
					this.info = res.data
				})
			}
		}
	}
</script>

<style scoped>
	.app-content {
		width: 100%;
		padding: 20rpx 40rpx;
		background-color: #fff;
	}
</style>
