<template>
	<view class="content search-form">
		<view class="search-box">
			<!-- mSearch组件 如果使用原样式，删除组件元素-->
			<m-search class="mSearch-input-box" :mode="2"  :placeholder="defaultKeyword" @search="doSearch(false)"
			 @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></m-search>
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<!-- 						
			<view class="input-box">
				<input type="text" :adjust-position="true" :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
				 placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<view class="search-btn" @tap="doSearch(false)">搜索</view> 
			 -->
			<!-- 原样式 end -->
		</view>
		<view v-if="isShow" class="search-tip">
				更加精准请使用
				<navigator class="search-super"  open-type="switchTab" hover-class="other-navigator-hover" url='/pages/search/index' >高级检索</navigator>
				<u-icon :size="32" class = "u-icon" name="close" @click="isShow=false"></u-icon>
		</view>
		<view class="search-keyword">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<block v-for="(row,index) in keywordList" :key="index">
					<view class="keyword-entry" hover-class="keyword-entry-tap">
						<view class="keyword-text" @tap.stop="doSearch(keywordList[index].keyword)">
							<rich-text :nodes="row.htmlStr"></rich-text>
						</view>
						<view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)">
							<image src="/static/HM-search/back.png"></image>
						</view>
					</view>
				</block>

			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block"  v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view class = "u-form-title">历史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/images/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view class = "swCheck" v-for="(keyword,index) in oldKeywordList"  :key="index"  @click.self="doSearch(keyword)">
							<u-icon @click.stop.native="handleDelItem(keyword,index)" class = "u-icon-close" name="close-circle-fill" color="#CCCCCC" size="28"></u-icon>
							<view class="swCheck-area">
								{{keyword}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';

	export default {
		data() {
			return {
				isShow: true,
				defaultKeyword: "请输入搜索内容",
				keyword: "",
				oldKeywordList: [],
				keywordList: [],
				isShowKeywordList: false
			}
		},
		onLoad() {
			this.init();
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch
		},
		methods: {
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
			},
			blur() {
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//监听输入
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				//以下示例截取淘宝的关键字，请替换成你的接口
				uni.request({
					url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
					success: (res) => {
						this.keywordList = [];
						this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);

					}
				});
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setKeyword(index) {
				this.keyword = this.keywordList[index].keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '您确定要删除全部历史搜索？',
					success: (res) => {
						if (res.confirm) {
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
						}
					}
				});
			},
			handleDelItem(keyword,index){
				console.log(1)
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						OldKeys.splice(index, 1);
						//最多10个纪录
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
						// this.doSearch(keyword)
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//执行搜索
			doSearch(keyword) {
				keyword = keyword === false ? this.keyword : keyword;
				this.keyword = keyword;
				this.saveKeyword(keyword); //保存为历史 
				uni.showToast({
					title: keyword,
					icon: 'none',
					duration: 2000
				});
				// searchModel.searchGlobal({
				// 	"queryString":keyword
				// }).then(res=>{
					uni.navigateTo({
						url:`/pages/search/result?queryString=${keyword}`
					})
				// })
				
				//以下是示例跳转淘宝搜索，可自己实现搜索逻辑
				/*
				//#ifdef APP-PLUS
				plus.runtime.openURL(encodeURI('taobao://s.taobao.com/search?q=' + keyword));
				//#endif
				//#ifdef H5
				window.location.href = 'taobao://s.taobao.com/search?q=' + keyword
				//#endif
				*/
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>

	.search-tip {
		width: 100%;
		padding: 30upx 20upx;
		background-color: #FFF5D9;
		color: #333333;
		font-size: 28upx;
		text-align: center;
		white-space: nowrap;
		.search-super{
			text-decoration: underline;
			color: #FF5948;
			display: inline;
		}
		.u-icon{
			float: right;
		}
	}

	.search-box {
		width: 100%;
		background-color: #fff;
		padding: 15upx 2.5%;
		display: flex;
		justify-content: space-between;
		position: sticky;
		top: 0;
	}

	.search-box .mSearch-input-box {
		width: 100%;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.search-box .search-btn {
		width: 15%;
		margin: 0 0 0 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 28upx;
		color: #fff;
		background: linear-gradient(to right, #ff9801, #ff570a);
		border-radius: 60upx;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 60upx;
		font-size: 32upx;
		border: 0;
		border-radius: 60upx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #ffffff;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

	.search-keyword {
		width: 100%;
		background-color: rgb(242, 242, 242);
	}

	.keyword-list-box {
		height: calc(100vh - 110upx);
		padding-top: 10upx;
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.keyword-entry {
		width: 94%;
		height: 80upx;
		margin: 0 3%;
		font-size: 30upx;
		color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1upx #e7e7e7;
	}

	.keyword-entry image {
		width: 60upx;
		height: 60upx;
	}

	.keyword-entry .keyword-text,
	.keyword-entry .keyword-img {
		height: 80upx;
		display: flex;
		align-items: center;
	}

	.keyword-entry .keyword-text {
		width: 90%;
	}

	.keyword-entry .keyword-img {
		width: 10%;
		justify-content: center;
	}

	.keyword-box {
		height: calc(100vh - 110upx);
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
	}
</style>
