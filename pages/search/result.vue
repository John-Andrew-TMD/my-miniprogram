<template>
  <view class="">
    <my-dropdown
      v-if="filterData.taxFilterData"
      :filterData="filterData"
    ></my-dropdown>
    <view id="app-tip" class="app-tip">
      <view class="app-tip-title">
        共搜索出 <span>{{ tableOptions.listData.length }}</span> 条结果
      </view>
	 <div class="filter-box">
	  </div>
    </view>
    <scroll-view
      scroll-y="true"
      class="main"
      :style="{ height: `calc(100vh - ${70 + tipHeight}px)` }"
      @scrolltolower="onreachBottom"
	  :lower-threshold = "20"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      @refresherrefresh="onpullDownRefresh"
      @refresherrestore="onRestore"
    >
      <list-create
        :status="status"
        :swiper-height.sync="swiperHeight"
        :options="tableOptions"
        :uEmptyOption="uEmptyOption"
      ></list-create>
    </scroll-view>
  </view>
</template>

<script>
import ListCreate from "@/components/common/ListCreate";
import MyDropdown from "@/components/search/my-dropdown";
import { IndexModel } from "@/models/index.js";

const indexModel = new IndexModel();
import { AppModel } from "@/models/app.js";

const appModel = new AppModel();
export default {
  components: {
    ListCreate,
    MyDropdown
  },
  data() {
    return {
      triggered: false,
      status: "loading",
      swiperHeight: "0px",
      tableOptions: {
        listData: []
      },
	    filterList: [
	          {
	            code: "other",
	            defaultCode: "keywords",
	            key: "关键词",
	            list: []
	          },
	          {
	            code: "second",
	            defaultCode: "defaultSecondaryCategory",
	            key: "文章分类",
	            list: []
	          },
	          {
	            code: "tax",
	            defaultCode: "defaultTaxTags",
	            key: "税种",
	            list: []
	          },
	          {
	            code: "availability",
	            defaultCode: "defaultAvailability",
	            key: "有效性",
	            list: []
	          },
	          {
	            code: "level",
	            defaultCode: "defaultLevel",
	            key: "生效区域",
	            list: []
	          },
	          {
	            code: "publishTimeStats",
	            defaultCode: "checkedKeysTime",
	            key: "发布时间",
	            list: []
	          }
	        ],
      uEmptyOption: {
        showTip: true,
        marginTop: 240,
        text: " ",
        iconSize: 500,
        src: require("static/images/default-icon.png")
      },
      pages: 1,
      listParams: {
        condition: {
          queryString: "",
          searchScope: {
            category: [],
            secondaryCategory: []
          }
        },
        pageNo: 1,
        pageSize: 10
      },
      tipHeight: 0,
      filterData: {}
    };
  },
  onLoad: function(options) {
    this._freshing = false;
    setTimeout(() => {
      this.triggered = true;
    }, 1000);
    this.listParams.condition.queryString = options.queryString;
    uni
      .createSelectorQuery()
      .in(this)
      .select("#app-tip")
      .boundingClientRect()
      .exec(rect => {
        this.tipHeight = rect[0].height;
      });
    this.init();
  },
  methods: {
    init() {
      this.getFilterlist();
      this.getListData();
    },
    onRestore() {
      this.triggered = "restore"; // 需要重置
    },
    onpullDownRefresh(e) {
      if (this._freshing) return;
      this._freshing = true;
      this.listParams.pageNo = 1;
      this.getListData();
      setTimeout(() => {
        this.triggered = false;
        this._freshing = false;
      }, 1000);
    },
    onreachBottom(e) {
      if (this.listParams.pageNo >= this.pages) {
        this.status = "nomore";
        return;
      }
      this.listParams.pageNo++;
      this.getListData();
    },
    getListData() {
      this.status = "loading";
      indexModel
        .getSearchLawLib(this.listParams)
        .then(res => {
          let listData = res.data && res.data.result && res.data.result.records;
          this.pages = res.data.result.pages;
          let tableOptions = {
            listData:
              this.listParams.pageNo == 1
                ? listData
                : this.tableOptions.listData.concat(listData),
            index: this.swiperCurrent,
            keyList: {
              content: "title",
              detail: "licence",
              timestamp: "updateTime"
            }
          };
          this.tableOptions = Object.assign(this.tableOptions, tableOptions);
          this.$set(this.tableOptions, 0, tableOptions);
          if (this.listParams.pageNo >= this.pages) {
            this.status = "nomore";
          } else {
            this.status = "loadmore";
          }
          this.$store.commit("SET_SEARCHID", res.data.searchId);
          uni.stopPullDownRefresh();
        })
        .catch(err => {
          this.status = "loadmore";
          uni.stopPullDownRefresh();
        });
    },
    getFilterlist() {
      appModel
        .filterlist({
          filterTypeList: ["all"]
        })
        .then(res => {
          let { regionFilterData, taxFilterData } = res.data;
          taxFilterData.forEach((item, index) => {
            item.label = item.name;
            item.value = item.code;
            item.isChecked = false;
          });
          this.filterData = {
            taxFilterData,
            regionFilterData,
            sort: [
              {
                label: "发布时间",
                value: 0
              },
              {
                label: "按匹配度",
                value: 1
              }
            ]
            // filter: []
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-tip {
  width: 100%;
  background-color: #fff;
  margin-bottom: 20upx;
  padding: 30upx;

  .app-tip-title {
    font-size: 28upx;
    color: #333333;

    span {
      color: #ff5948;
    }
  }
}
</style>
