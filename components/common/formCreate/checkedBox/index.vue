<template>
	<view class="keyword-block " >
		<view class="keyword keyword-checkbox">
			<view class="swCheck" :class="{ 'isChecked': item.isChecked }"  v-for="(item, index) in arr" :key="item.key">
				<span class="checkbox__label">
					{{item.label}}
					<br/>
					<span class = "checkbox__count" v-if = "showCount">（{{item.count}}条）</span>
				</span>
				<input class="checkbox__original" type="checkbox" @click="onClick(item,index)" :id="item.key" />
			</view>
		</view>
		
	</view>

</template>

<script>
	export default {
		// other code
		props:{
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
			this.arr = this.options.map(item => {
				return { ...item,
					key: `${item.label}---${item.value}`
				}
			})
		},
		methods: {
			onClick(item,index) {
				this.$set(this.arr, index,  {...item,isChecked:!item.isChecked})
				this.$emit('update:taxTagStats', this.arr.filter((item)=>item.isChecked))
			},
			handleResetClick(){
				this.arr.forEach((item)=>{
					item.isChecked = false
				})
				this.$emit('update:taxTagStats', this.arr.filter((item)=>item.isChecked))
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
