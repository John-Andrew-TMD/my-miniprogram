<template>
	<view>
		<u-form :model="form" class="search-form" ref="uForm" :error-type="errorType">
			<u-card class="u-card" :show-head="true" :show-foot="false" :full="true">
				<template slot="head">
					<view class="u-form-title">
						内容匹配
					</view>
				</template>
				<template slot="body">
					<u-form-item label="姓名" prop="name">
						<u-input v-model="form.name" />
					</u-form-item>
					<u-form-item label="简介" prop="intro">
						<u-input v-model="form.intro" />
					</u-form-item>
				</template>
			</u-card>
			<u-card class="u-card" :show-head="false" :show-foot="false" :full="true">
				<template slot="body">
					<u-form-item prop="date">
						<view class="u-form-item">
							<view class="u-form-title">
								日期范围
							</view>
							<view @click="showPicker" name="date" class="u-form-content">{{form.date.length!=0?`${form.date[0]}至${form.date[1]}`:'选择时间段' }}</view>
						</view>
						<template slot="right">
							<u-icon v-if="form.date.length!=0" name="close-circle-fill" color="#999" size="28" @click="form.date=[]"></u-icon>
							<u-icon v-else name="arrow-right" color="#999" size="28"></u-icon>
						</template>
					</u-form-item>
				</template>
			</u-card>
			<u-card class="u-card" :show-head="false" :show-foot="false" :full="true">
				<template slot="body">
					<u-form-item prop="date">
						<view class="u-form-item">
							<view class="u-form-title">
								税种范围
							</view>
							<view @click="showUviewPicker" name="date" class="u-form-content">{{form.taxTags.length!=0?form.taxTags.map((item)=>item.label).join('/'):'选择税种' }}</view>
						</view>
					</u-form-item>
				</template>
			</u-card>
			<view class="custom-style">
				<u-button throttle-time="1000" type="error" @click="handleSubmit">搜索</u-button>
			</view>
		</u-form>
		<w-picker
		    v-if="componentName == 'wPicker'"
		    :visible.sync="isShow"
		    mode="range"
		    :startYear="startDate"
		    :endYear="endDate"
		    :value="value"
		    :current="true"
		    fields="month"
		    @confirm="bindChange($event, 'range')"
		    @cancel="bindCancel"
		    :disabled-after="false"
		    ref="date"
		  ></w-picker>
		  <popur-search 
		  :isShow = "isShow" 
		  :keyList = "keyList"
		  :options="filterlist.taxFilterData" 
		  :taxTagStats.sync="form.taxTags"
		  v-else-if="componentName=='uPopup'" 
		  :changeIsShow.sync = "isShow"></popur-search>
	</view>


</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import popurSearch from "@/components/search/popur-search.vue";
	import {
		mapState
	} from 'vuex'
	import {
		AppModel
	} from '@/models/app.js'
	const appModel = new AppModel()
	export default {
		components: {
			wPicker,
			popurSearch
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				componentName: "wPicker",
				errorType: ['message'],
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					intro: [{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					}]
				},
				filterlist:{},
				form: {
					name: '',
					intro: '',
					sex: '',
					date: [],
					taxTags:''
				},
				isShow: false,
				value: ['2020-01-01', '2020-10-01']
			};
		},
		computed: {
			...mapState({
				//这里可以通过这种方式引用相应模块的state数据，其中user是模块名。在代码的其他部分可以使用this.userInfo访问数据
				searchId: ({home}) => home.searchId,
			}),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			init() {
				this.getFilterlist()
			},
			getFilterlist() {
				appModel.filterlist({filterTypeList:["all"]}).then(res=>{
					let {secondaryCategoryFilterData,taxFilterData} = res.data
					
					taxFilterData.forEach((item,index)=>{
						item.label = item.name
						item.value = item.code
						item.isChecked = false
					})
					this.filterlist =  {secondaryCategoryFilterData,taxFilterData}
				})
			},
			handleSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.navigateTo({
							url:`/pages/search/result?queryString=${keyword}`
						})
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			},
			showUviewPicker(e) {
				this.componentName = 'uPopup'
				this.isShow = true
			},
			showPicker(e) {
				this.componentName = 'wPicker'
				this.isShow = true
			},
			bindChange(data) {
				this.form.date = data.value
			},
			bindCancel(e) {
				console.log(e)
			},
			getDate(type) {
				const date = new Date();
				let year = (type == "start") ? 1949 : date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}`;
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.init()
		}
	};
</script>
<style lang="scss" scoped>
	
	.custom-style {
		width: 550upx;
		border-radius: 22px;
		margin: 0 auto;
		overflow: hidden;
	}

	.u-card {
		/deep/ .u-card__body {
			padding-bottom: 0 !important;
			padding-top: 0 !important;
		}
	}
</style>
