<template>
	<view class="my-dropdown">
		<u-dropdown ref="uDropdown" active-color="#FF5948" inactive-color="#666666" class="u-dropdown" height="88">
			<template v-for="(item, key) in dropdownItem">
				<u-dropdown-item v-if="key == 'taxFilterData'" :title="key | formatFilterlist" :key="key">
					<view class="u-search-popup tax">
						<scroll-view class="scroll-view" scroll-y="true">
							<checked-box 
							ref="checkedBox" 
							:onlyCode = "true" 
							:showCount="true" 
							:options="item" 
							:optionsKey="key" 
							:check-box-value.sync = "searchForm.taxTags" >
							</checked-box>
						</scroll-view>
						<view class="u-popup-bottom">
							<u-button class="u-popup-button u-default-btn" :hair-line="false" @click="handleResetClick(key)">重置</u-button>
							<u-button class="u-popup-button" type="error" @click="handlePopupClick(item,key)">确定<span>({{getCheckedCount(item)}}条)</span></u-button>
						</view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item v-else-if="key == 'sort'" :title="key | formatFilterlist" :options="item" :key="key">
				</u-dropdown-item>
				<u-dropdown-item v-else-if="key == 'regionFilterData'" :title="key | formatFilterlist" :key="key">
					<view class="u-search-popup tax search-form">
						<scroll-view class="scroll-view" style="max-height: 600upx;" scroll-y="true">
							<u-radio-group v-model="searchForm.level" @change="radioGroupChange">
							<view v-for="(el,elKey) in item" :key="elKey">
									<view class="u-tree-title">
										<view class="u-tree-item">
											{{el.name}}
											<view class="ly-tree-node__count">
												({{el.count}}条)
											</view>
											<u-radio class = "u-radio" active-color="#FF5948" :key="index"  :name = "el.code"></u-radio>
										</view>
									</view>
									<tree-create 
									v-if="el.data"
									ref="treeCreate" 
									:showCount="true" 
									:options="el.data"
									:countSummary.sync="countSummary"
									:district.sync="searchForm.district" 
									:city.sync="searchForm.city">
									</tree-create>
							</view>
							</u-radio-group>
						</scroll-view>
						<view class="u-popup-bottom">
							<u-button class="u-popup-button u-default-btn" :hair-line="false" @click="handleResetClick(key)">重置</u-button>
							<u-button class="u-popup-button" type="error" @click="handlePopupClick(item,key)">确定<span>({{countSummary}}条)</span></u-button>
						</view>
					</view>
				</u-dropdown-item>
			</template>
		</u-dropdown>
		<view class="u-dropdown__menu__item last-item" @click="showUviewPicker">
			<view class="u-flex">
				<text class="u-dropdown__menu__item__text">筛选</text>
				<view class="u-dropdown__menu__item__arrow">
					<u-icon :custom-style="{ display: 'flex' }" :name="filterIcon" size="36"></u-icon>
				</view>
			</view>
		</view>
		<u-popup width="85.33%" v-model="visiabled" @close="handlePopupClose" mode="right">
				<comp-other-filter :visiabled.sync = "visiabled" @handlePopupClick = "handlePopupClick"></comp-other-filter>
		</u-popup>
	</view>
</template>

<script>
	import checkedBox from "@/components/common/formCreate/checkedBox";
	import treeCreate from "@/components/common/treeCreate/";
	import CompOtherFilter from "./components/CompOtherFilter.vue"
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			checkedBox,
			treeCreate,
			CompOtherFilter
		},
		computed: {
			...mapGetters({
				filterData: 'filterData'
			})
		},
		data() {
			return {
				visiabled: false,
				taxTagStats: [],
				searchForm: {
					level:"A"
				},
				dropdownItem:[],
				countSummary: 0,
				filterIcon: require('static/images/filter.png')
			};
		},
		
		filters: {
			formatFilterlist(val) {
				switch (val) {
					case "taxFilterData":
						return "税种";
					case "regionFilterData":
						return "效力范围";
					case "sort":
						return "排序";
				}
			}
		},
		mounted: function() {
			this.$nextTick(()=>{
				this.init();
			})
		},
		methods: {
			init() {
				let {taxFilterData,regionFilterData,sort} =  this.filterData
				this.dropdownItem = {
					taxFilterData,
					regionFilterData,
					sort
				}
			},
			radioGroupChange(){
				
			},
			getCheckedCount(item) {
				return item.filter(el => el.isChecked).map(el => el.count).reduce((prev, cur) => prev + cur, 0)
			},
			showUviewPicker(e) {
				this.$refs.uDropdown.close();
				this.visiabled = true
			},
			handlePopupClose() {
				this.visiabled = false
			},
			handlePopupClick(item, key) {
				if(item){
					let isChecked =""
					let searchForm = this.searchForm
					switch (key) {
						case "taxFilterData":
							isChecked = searchForm.taxTags.length
							break
						case "regionFilterData":
							isChecked = searchForm.district.length|| searchForm.city.length|| searchForm.level.length
							break
						default:
							break
					}
					var index = Object.keys(this.filterData).findIndex(() => key)
					if (isChecked) {
						this.$refs.uDropdown.highlight(index)
					} else {
						this.$refs.uDropdown.highlight()
					}
					this.$store.commit("SET_LISTPARAMSCOPE", this.searchForm)
					this.$refs.uDropdown.close();
				}
				this.$emit("init", "")
			},
			handleResetClick(key) {
				switch (key) {
					case "taxFilterData":
						this.$refs.checkedBox[0].handleResetClick();
						break
					case "regionFilterData":
						this.$refs.treeCreate[0].$children[0].setCheckAll(false)
						break
					default:
						break;
				}
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
			width: 142rpx;
			padding-left: 30rpx;
			height: 40rpx;
			display: flex;
			justify-content: flex-end;
			align-items: end;
		}
	}

	.my-dropdown {
		display: flex;
		justify-content: center;
		background-color: #fff;
		border-bottom: 1px solid #F5F5F5;
		.u-search-popup {
			background: #fff;
			height: 100%;
			width: 100%;
			padding: 0 9rpx !important;
			border-top:1px solid #F6F6F6;
			.u-radio{
				margin-left: auto;
			}
			.u-tree-title{
				background-color: #F5F5F5;
				.u-tree-item{
					width: 100%;
					padding:24rpx 30rpx;
					background-color: #fff;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					justify-content: end;
				}
			}
		}
	}

	.ly-tree-node__count {
		font-size: 24rpx;
		color: #999999;
	}

</style>
