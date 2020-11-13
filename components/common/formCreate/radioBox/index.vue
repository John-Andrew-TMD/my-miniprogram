<template>
	<view class="keyword-block " >
		<view class="keyword keyword-checkbox">
			<view class="swCheck" :class="{ 'isChecked': item.isChecked }"  v-for="(item, index) in arr" :key="item.code">
				<span class="checkbox__label">
					{{item.name||item.label}}
					<br/>
					<span class = "checkbox__count" v-if = "showCount">（{{item.count}}条）</span>
				</span>
				<input class="checkbox__original" type="checkbox" @click="onClick(item,index)" :id="item.code" />
			</view>
		</view>
		
	</view>

</template>

<script>
	export default {
		// other code
		props:{
			onlyCode:{
				type:Boolean,
				default:false
			},
			options:{
				type:Array,
				default:()=>[]
			},
			showCount:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				arr:[],
				isChecked: true
			}
		},
		mounted(){
			this.arr = this.options
		},
		methods: {
			onClick(item,index) {
				this.handleResetClick()
				this.$set(this.arr, index,  {...item,isChecked:!item.isChecked})
				let itemChecked = this.arr.filter((item)=>item.isChecked)
				if(this.onlyCode){
					this.$emit('update:check-box-value', itemChecked.map(item => item.code)[0])
				}else{
					this.$emit('update:check-box-value', itemChecked[0])
				}
			},
			handleResetClick(){
				this.arr.forEach((item)=>{
					item.isChecked = false
				})
				let itemChecked = this.arr.filter((item)=>item.isChecked)
				if(this.onlyCode){
					this.$emit('update:check-box-value','')
				}else{
					this.$emit('update:check-box-value',{})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
