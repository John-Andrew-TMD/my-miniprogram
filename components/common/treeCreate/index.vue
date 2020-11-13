<template>
	<view class="app-content app-my-tree">
		<ly-tree 
		ref = "lyTree"
		iconClass = "my-tree-icon"
		 :props="props"
		 node-key="code" 
		:tree-data="options" 
		:highlightCurrent = "true" 
		:showCheckbox="true" 
		:ready="ready" 
		@check = "handleCheckChange"
		:checkStrictly = "true"
		>
		</ly-tree>
	</view>
</template>

<script>
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	export default {
		components: {
			LyTree
		},
		props:{
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
				ready: true, // 这里用于自主控制loading加载状态，避免异步正在加载数据的空档显示“暂无数据”
				treeData: [],
				city:[],
				district:[],
				 props: function() {
					return {
						// 这里的label就可以使用函数进行自定义的渲染了
						label(data, node) {
							return  node.data.name;
						}
						// label: 'personName', // 指把数据中的‘personName’当做label也就是节点名称
					}
				},
			};
		},
		mounted() {
			// 模拟异步请求
		},
		methods: {
			// uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleCheckChange(obj){
				let checkedNodes = this.$refs.lyTree.getCheckedNodes()
				let checkedKeys = this.$refs.lyTree.getCheckedKeys()
				checkedNodes.map(item=>{
					if(item.code==obj.node.key){
						if(+obj.node.level==1){
							item = {...item,level:1}
								this.city.push(item)
						}else if(+obj.node.level==2){
							item = {...item,level:2}
								this.district.push(item)
						}
					}else{
						this.city= this.city.filter(el => el.code !== obj.node.key)
						this.district= this.district.filter(el => el.code !== obj.node.key)
					}
				})
				if(!checkedNodes.length){
					this.city= this.city.filter(el => el.code !== obj.node.key)
					this.district= this.district.filter(el => el.code !== obj.node.key)
				}
				this.$emit("update:city",this.city.map(el=>el.code))
				this.$emit("update:district",this.district.map(el=>el.code))
				this.$emit("update:countSummary",checkedNodes.map(el => el.count).reduce((prev, cur) => prev + cur, 0))
			}
		}
	};
</script>

<style lang="scss" >

</style>
