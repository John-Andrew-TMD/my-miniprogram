<template>
	<u-popup width="85.33%" v-model="visiabled" @close="handlePopupClose" mode="right">
		<view class="u-search-popup search-form">
			<scroll-view class = "scroll-view" scroll-y="true">
				<view class="u-form-title" >
					税种范围
				</view>
				<checked-box ref = "checkedBox" :options="options" :taxTagStats.sync="taxTagStats"></checked-box>
			</scroll-view>
			
			<view class="u-popup-bottom">
				<u-button class="u-popup-button u-default-btn" @click = "handleResetClick" :hair-line="false">重置</u-button>
				<u-button class="u-popup-button" type="error" @click="handlePopupClick">确定</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import checkedBox from "@/components/common/formCreate/checkedBox";
	export default {
		components:{
			checkedBox
		},
		props: ['options', 'isShow'],
		data() {
			return {
				visiabled: false,
				taxTagStats:[]
			};
		},
		watch: {
			isShow: {
				handler(val) {
					// this.setAnnexMoney(0)
					this.visiabled = val
				},
				immediate: true
			}
			// taxTagStats: {
			// 	handler(val) {
			// 		this.$emit("update:taxTagStats",val)
			// 	},
			// 	immediate: true
			// }
		},
		mounted() {
		},
		methods: {
			handlePopupClose() {
				this.$emit("update:changeIsShow", false)
			},
			handlePopupClick(e) {
				this.$emit("update:taxTagStats",this.taxTagStats)
				this.$emit("update:changeIsShow", false)
			},
			handleResetClick(){
				this.$refs.checkedBox.handleResetClick()
			}
		}
	}
</script>

<style>
</style>
