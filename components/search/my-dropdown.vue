<template>
	<view class="my-dropdown">
		<u-dropdown active-color="#FF5948" inactive-color="#666666" class="u-dropdown" height="88">
			<template v-for="(item, key) in filterData">
				<u-dropdown-item v-if="key == 'taxFilterData'" v-model="searchForm[key]" :title="key | formatFilterlist" :key="key">
					<view class="u-search-popup tax">
						<scroll-view class="scroll-view" scroll-y="true">
							<checked-box ref="checkedBox" :showCount="true" :options="item" :taxTagStats.sync="taxTagStats"></checked-box>
						</scroll-view>
						<view class="u-popup-bottom">
							<u-button class="u-popup-button u-default-btn" :hair-line="false" @click="handleResetClick">重置</u-button>
							<u-button class="u-popup-button" type="error" @click="handlePopupClick">确定<span>({{
                    item
                      .map(el => el.count)
                      .reduce((prev, cur) => prev + cur, 0)
                  }}条)</span></u-button>
						</view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item v-else-if="key == 'sort'" v-model="searchForm[key]" :title="key | formatFilterlist" :options="item"
				 :key="key">
				</u-dropdown-item>
				<u-dropdown-item v-else-if="key == 'filter'" v-model="searchForm[key]" :title="key | formatFilterlist" :key="key">
				</u-dropdown-item>
				<u-dropdown-item v-else v-model="searchForm[key]" :title="key | formatFilterlist" :key="key">
					{{ item }}
				</u-dropdown-item>
			</template>
		</u-dropdown>
		<view class="u-dropdown__menu__item last-item" @click="showUviewPicker">
			<view class="u-flex">
				<text class="u-dropdown__menu__item__text">筛选</text>
				<view class="u-dropdown__menu__item__arrow">
					<u-icon :custom-style="{ display: 'flex' }" name="arrow-down" size="26"></u-icon>
				</view>
			</view>
		</view>
		<u-popup width="85.33%" v-model="visiabled" @close="handlePopupClose" mode="right">
			<view class="u-search-popup search-form">
				<scroll-view class = "scroll-view" scroll-y="true">
				</scroll-view>
				<view class="u-popup-bottom">
					<u-button class="u-popup-button u-default-btn" @click = "handleResetClick" :hair-line="false">重置</u-button>
					<u-button class="u-popup-button" type="error" @click="handlePopupClick">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import checkedBox from "@/components/common/formCreate/checkedBox";

	export default {
		props: {
			filterData: {
				type: Object,
				default: {
					taxFilterData: [],
					regionFilterData: [],
					sort: []
				}
			}
		},
		components: {
			checkedBox
		},
		data() {
			return {
				visiabled: false,
				taxTagStats: [],
				searchForm: {}
			};
		},
		onLoad: function(options) {
			this.init();
		},
		filters: {
			formatFilterlist(val) {
				switch (val) {
					case "taxFilterData":
						return "税种";
					case "regionFilterData":
						return "效力范围";
						// case "filter":
						//   return "筛选";
					case "sort":
						return "排序";
				}
			}
		},
		methods: {
			init() {},
			showUviewPicker(e) {
				this.visiabled = true
			},
			handlePopupClose(){
				this.visiabled = false
			},
			handlePopupClick(e) {
				this.visiabled = false
			},
			handleResetClick() {
				this.$refs.checkedBox[0].handleResetClick();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.last-item {
		margin-right: 42rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.u-flex {
			color: #606266;
			border-left: 1px solid #eee;
			width: 132rpx;
			padding-left: 40rpx;
			height: 40rpx;
		}
	}

	.my-dropdown {
		display: flex;
		justify-content: center;
		background-color: #fff;
		border-bottom: 1px solid #F5F5F5;
		 .swCheck {
			padding: 0 25rpx !important;
			width: 31.4% !important;
		}
		
		.u-search-popup {
			background: #fff;
			height: 100%;
			width: 100%;
		}
	}

	// .my-dropdown /deep/ .u-dropdown__content {
	//   width: 750rpx !important;
	// }

	
</style>
