<template>
	<view class="u-search-popup search-form">
		<scroll-view class="scroll-view" scroll-y="true">
			<view class="u-form-title">
				法规分类
			</view>
			<view class="keyword-block ">
				<view class="keyword keyword-checkbox">
					<view class="swCheck" style="width:100%">
						<span class="checkbox__label inline" style="align-items: baseline;">
							选择法规
						</span>
						<u-icon class = "u-icon" color="#CCCCCC" name="arrow-right" :size="28"></u-icon>
					</view>
				</view>
			</view>
			<view class="u-form-title">
				有效性
			</view>
			<checked-box ref="checkedBox" :options="filterData.availabilityFilterData" :check-box-value.sync="searchForm.validity"
			 :onlyCode="true" :showCount="true">
			</checked-box>
			<view class="u-form-title">
				发布时间
			</view>
			<radio-box ref="radioBox" :options="filterData.recordArticleTimeFilterData" :check-box-value.sync="searchForm.timeCode"
			 :onlyCode="true" :showCount="true">
			</radio-box>
		</scroll-view>
		<view class="u-popup-bottom">
			<u-button class="u-popup-button u-default-btn" @click="handleResetClick(key)" :hair-line="false">重置</u-button>
			<u-button class="u-popup-button" type="error" @click="handlePopupClick()">确定</u-button>
		</view>
	</view>
</template>

<script>
	import checkedBox from "@/components/common/formCreate/checkedBox";
	import radioBox from "@/components/common/formCreate/radioBox";
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			checkedBox,
			radioBox
		},
		props: {

		},
		computed: {
			...mapGetters({
				listParams: 'listParams',
				filterData: 'filterData'
			})
		},
		data() {
			return {
				searchForm: {},
			};
		},
		mounted() {},
		methods: {
			handlePopupClick(item, key) {
				this.listParams.condition.searchScope = { ...this.listParams.condition.searchScope,
					...this.searchForm
				}
				this.$store.commit("SET_LISTPARAMSCOPE", this.listParams.condition.searchScope)
				this.$emit("update:visiabled", false)
				this.$emit("handlePopupClick","")
			},
			handleResetClick(key) {
				this.$refs.checkedBox.handleResetClick();
				this.$refs.radioBox.handleResetClick();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-icon {
	    /* position: static!important; */
	    margin-left: auto;
	/*    margin-right: 30rpx;
	    right: auto;
	    top: 0;
	    transform:none; */
	}
</style>
