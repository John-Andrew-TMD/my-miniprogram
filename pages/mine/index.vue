<template>
	<view class="mine-container">
		<view class="app-bars">
			<view class="app-title">
				<view class="title-content">
					<view class="app-avatar">
						<u-avatar :src="src" :text="text"></u-avatar>
					</view>
					<view class="mine-content">
						<view class="mine-user">
							用户138*****000
						</view>
						<view class="mine-rank">
							<image :src="mineRank" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			<u-cell-group class="u-cell" v-for="(item,index,key) in btnArray" :key="index">
				<u-cell-item :title="item.title" :arrow="true" arrow-direction="right" @click="handleCellClick(index)">
					<view slot="icon">
						<u-image class = "the-u-image" mode="aspectFit" :src='item.image'>
						</u-image>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
		<u-modal v-model="show" title="联系电话" :show-cancel-button="false" confirm-text="我知道了" :confirm-style="{color:'#FF5948'}"
		 :title-style="{color: '#333333'}">
			<view class="slot-content">
				<rich-text nodes="400 - 88888-888"></rich-text>
			</view>
		</u-modal>
	</view>
</template>
<style lang="scss" scoped>
	.mine-container {
		width: 100%;

		.slot-content {
			color: #666666;
			line-height: 44upx;
			height: 110upx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.app-bars {
			margin: 0 auto;
			width: 89.33%;
			margin-top: 40upx;

			.u-cell {
				display: block;
				margin-top: 30upx;

				.the-u-image {
					width: 80upx;
					display: block;

					/deep/ .u-image {
						display: flex;
					}
				}

				/deep/ .u-cell_title {}

				/deep/ .u-image__image {
					width: 80upx;
					height: 80upx;
					display: inline-block;
				}
			}
			.app-title {
				background: url(~@/static/images/person/bg.png) no-repeat center center;
				width: 100%;
				border-radius: 16upx;
				height: 228upx;

				.title-content {
					margin: 0 auto;
					width: 89.33%;
					height: 100%;
					display: flex;
					align-items: center;

					.app-avatar {
						border-radius: 100%;
						width: 128upx;
						height: 128upx;
						background: #fff;
					}

					.mine-content {
						flex: 1;
						margin-left: 30upx;

						.mine-user {
							font-size: 20px;
							font-weight: 600;
							color: #FFFFFF;
							line-height: 26px;
							margin-bottom: 16upx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.mine-rank {
							width: 96upx;

							&>image {
								width: 100%;
							}
						}
					}
				}

			}
		}
	}
</style>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {},
		data() {
			return {
				src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
				text: '无头像',
				mineRank: require("static/images/person/mine-rank.png"),
				show: false,
				btnArray: [{
						'title': '消息设置',
						'image': require("static/images/person/icon@2x(2).png")
					},
					{
						'title': '兑换权益',
						'image': require("static/images/person/icon@2x.png")

					}, {
						'title': 'APP操作使用手册',
						'image': require("static/images/person/book.png")
					},
					{
						'title': '联系我们',
						'image':require("static/images/person/msg.png")
					}
				]
			}
		},
		computed: {

		},
		filters: {

		},
		methods: {
			handleCellClick(index) {
				switch (index) {
					case 0:
						break;
					case 1:

						break;
					case 2:
						break;
					case 3:
						this.handleAboutUs()
						break;
					default:
						break;
				}
			},
			handleAboutUs() {
				this.show = true
			}
		}
	}
</script>
