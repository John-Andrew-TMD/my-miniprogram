<template>
	<view class="app-content">
		<view class="app-title">
			热门文件
		</view>
		<swiper class = "app-hot-title" :vertical="true" :autoplay="true" :style="{'height':'187px'}"  >
			<swiper-item class="swiper-item" v-for="(item, index) in listData" :key="index">
				<scroll-view scroll-y="true" >
					<list-create :swiper-height.sync="swiperHeight" :options="getOption(item,index)"></list-create>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import {
		sliceArrayGroup
	} from 'utils'
	import ListCreate from "@/components/common/ListCreate"
	export default {
		components: {
			ListCreate
		},
		computed: {
			listData() {
				return sliceArrayGroup(this.tableOptions.listData, 2)
			}
		},
		data() {
			return {
				swiperHeight: "0px",
				tableOptions: {
					requestUrl: false,
					listData: [{
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}, {
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}, {
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}, {
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}, {
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}, {
							id:"185812",
							content: "1关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						},
						{
							id:"185812",
							content: "2关于继续实施全国中小企业股份转让系统挂牌公司股息红利差别化个人所得税政策",
							detail: "发改办财规 [2019] 860号",
							timestamp: Date.parse(new Date())
						}
					],
				}
			};
		},
		methods: {
			getOption(item,index) {
				let list = {
					requestUrl: false,
					index,
					listData:item
				}
				return list
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-content {
		width: 690upx;
		min-height: 418upx;
		background: #FFFFFF;
		box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
		border-radius: 4px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 30upx;
		.app-hot-title{
			width: 100%;
		}
		.app-title {
			margin-top: 24upx;
			padding: 0 30upx;
			font-size: 16px;
			font-weight: 500;
			color: #333333;
			line-height: 22px;
		}
	}
</style>
