<template>
	<view class="keyword-block " >
		<view class="keyword keyword-checkbox">
			<view class="swCheck" :class="{ 'isChecked': item.isChecked }"  v-for="(item, index) in arr" :key="item.code">
				<span class="checkbox__label">
					{{item.name||item.label}}
					<br/>
					<span class = "checkbox__count" v-if = "showCount">（{{item.count}}条）</span>
				</span>
				<view class="checkbox__original"  @click="onClick(item,index)" :id="item.code">
					
				</view>
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
			optionsKey:{
				type:String,
				default:""
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
			this.arr = this.options.map(item => {
				return { ...item,
					key: `${item.name}---${item.code}`
				}
			})
		},
		methods: {
			onClick(item,index) {
				this.$set(this.arr, index,  {...item,isChecked:!item.isChecked})
				let itemChecked = this.arr.filter((item)=>item.isChecked)
				if(this.onlyCode){
					this.$emit('update:check-box-value', itemChecked.map(item => item.code))
				}else{
					this.$emit('update:check-box-value', itemChecked)
				}
				this.$emit('callback',{item:this.arr,key:this.optionsKey})
			},
			handleResetClick(){
				this.arr.forEach((item)=>{
					item.isChecked = false
				})
				let itemChecked = this.arr.filter((item)=>item.isChecked)
				if(this.onlyCode){
					this.$emit('update:check-box-value', itemChecked.map(item => item.code))
				}else{
					this.$emit('update:check-box-value', itemChecked)
				}
				this.$emit('callback',{item:this.arr,key:this.optionsKey})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.checkbox__original{
		opacity: 0;
		cursor: pointer;
	}
</style>
