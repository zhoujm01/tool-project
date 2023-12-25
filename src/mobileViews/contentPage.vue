<template>
  <div class="mainPage">
    <!-- 手机端头部 -->
    <div class="titleSpace">
      <div class="titleArea">
        <img class="titleLogo" src="/picture/mobile/返回.png" @click="clickBack" />
        <div class="titleFont">{{ currentMenuList["title"] }}</div>
      </div>
    </div>
    <!-- 主体部分 -->
    <div class="contentSpace">
      <!-- 搜索框 -->
      <a-input-search v-model:value="searchValue" placeholder="输入关键词" size="large" enter-button="搜索" @search="onSearch"
        class="searchInput">
        <template #prefix>
          <img class="searchLogo" src="/picture/mobile/icon_搜索.png" />
        </template>
      </a-input-search>
      <!-- 显示菜单按钮区域 -->
      <div class="menuSpace">
        <!-- 菜单按钮 -->
        <a-tabs v-model:activeKey="activeKey" class="contentTab" @change="tabChange">
          <template v-for="item in currentMenuList['childMenuList']" :key="item.key">
            <a-tab-pane :tab="item.title" class="contentArea">
              <template v-for="item2 in item.childContentList">
                <div class="contentItemArea" @click="clickItem(item2)">
                  <!-- 无图片/视频 -->
                  <div class="contentImg" :style="{ display: item2.bgType == 0 ? 'block' : 'none' }" />
                  <!-- 图片 -->
                  <img :src="item2.bgimg" class="contentImg" :style="{ display: item2.bgType == 1 ? 'block' : 'none' }" />

                  <!-- 视频 -->
                  <div class="contentImg" :style="{ display: item2.bgType == 2 ? 'block' : 'none' }">
                    <video alt="example" style="width: 100%;height:100%;" :src="item2.bgimg" :autoplay="false"></video>
                    <PlayCircleFilled
                      style="fontSize:7vh;color:rgb(80, 146, 244);position: absolute;background: white;border-radius: 3.5vh;left: calc(50% - 3.5vh);top: calc(50% - 3.5vh);" />
                  </div>
                  <div class="contentText">{{ item2.title }}</div>
                </div>
              </template>
            </a-tab-pane>
          </template>
          <template #renderTabBar="{ DefaultTabBar, ...props }">
            <component :is="DefaultTabBar" v-bind="props" class="tabTitle" />
          </template>
        </a-tabs>
      </div>
    </div>
    <div class="insertButtonArea" @click="clickAdd()">
      <img src="../assets/svgs/添加按钮2.svg" style="width: 50px;" />
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive, watch, h, onMounted, onUnmounted } from "vue";
import icon1 from "../assets/svgs/icon_附件.svg";
import icon2 from "../assets/svgs/icon_施工流程.svg";
import icon3 from "../assets/svgs/icon_自由主题.svg";
import icon4 from "../assets/svgs/icon_附件.svg";
import icon5 from "../assets/svgs/icon_牵张场地选择.svg";

import mobileIcon1 from "/picture/mobile/icon_预控及诊断处理系统.png";
import mobileIcon2 from "/picture/mobile/icon_施工流程.png";
import mobileIcon3 from "/picture/mobile/icon_自由主题.png";
import mobileIcon4 from "/picture/mobile/icon_附件安装.png";
import mobileIcon5 from "/picture/mobile/icon_牵张场地选择.png";

import { PlayCircleFilled } from "@ant-design/icons-vue";

import { getReportData } from "../api/data";

import { getToolData } from "../api/tooldata";

export default {
  components: {
    PlayCircleFilled
  },
  setup() {
    const router = useRouter();
    const key = ref(router.currentRoute.value.query.key);
    const sub = ref(router.currentRoute.value.query.sub);

    const type = ref(router.currentRoute.value.query.type);


    // 1:诊断;2:工器具
    const flag = ref();

    const searchValue = ref();
    const onSearch = () => {
      let type = 0;
      if (flag.value == 1) {
        type = 0;
      } else if (flag.value == 2) {
        type = 1;
      }
      router.push({
        path: "/searchPage",
        query: {
          key: searchValue.value,
          type: type,
        }
      });
    };
    const activeKey = ref();
    const menuList = ref();

    // 当前subindex
    const subIndex = ref(sub.value);
    // 当前所有subkey
    const subList = ref([]);

    const oldTypeList = ref();

    const currentMenuList = ref([]);

    // 获取当前菜单中的子菜单
    const getInfor = () => {
      // // console.log("sub:",sub.value)
      if (flag.value == 1) {
        menuList.value.forEach(item => {
          if (item.key == key.value) {
            currentMenuList.value = item;

            if (
              currentMenuList.value['childMenuList'] != null &&
              currentMenuList.value['childMenuList'].length > 0
            ) {
              activeKey.value = item.childMenuList[parseInt(sub.value.toString())].key;
              subList.value = [];
              currentMenuList.value['childMenuList'].forEach(item2 => {
                subList.value.push(item2.key);
                if (
                  item2.childContentList != null &&
                  item2.childContentList.length > 0
                ) {
                  item2.childContentList.forEach(item3 => {
                    item3.bgType = 0;
                    if (item3.medialist != null && item3.medialist.length > 0) {
                      // 4级按key排序
                      let templist = [];
                      let i = 1;
                      let tempItem = item3.medialist.filter((item5) => {
                        let indexkey = item5.index.split("-");
                        return i == indexkey[3]
                      })
                      if (tempItem != null && tempItem.length > 0) {
                        templist.push(tempItem[0]);
                        if (tempItem[0].type == "img") {
                          item3.bgType = 1;
                        } else if (tempItem[0].type == "video") {
                          item3.bgType = 2;
                        }
                      } else {
                        // 显示空白图片
                        item3.bgType = 0;
                      }
                    } else {
                      // 显示空白图片
                      item3.bgType = 0;
                    }
                  });
                }
              });
            }
          }
        });
      } else if (flag.value == 2) {
        if (type.value == "basics" || type.value == "stringing") {
          // 无分级
          menuList.value = [];
          let tempList1 = {
            key: "1",
            label: "",
            title: "",
            childMenuList: []
          };
          let tempList2 = {
            label: "",
            title: "",
            key: "1-1",
            first: "1",
            childContentList: []
          };
          if (type.value == "basics") {
            tempList1 = {
              key: "1",
              label: "基础施工",
              title: "基础施工",
              childMenuList: []
            };
            tempList2 = {
              label: "基础施工",
              title: "基础施工",
              key: "1-1",
              first: "1",
              childContentList: []
            };
          } else if (type.value == "stringing") {
            tempList1 = {
              key: "1",
              label: "架线工程",
              title: "架线工程",
              childMenuList: []
            };
            tempList2 = {
              label: "架线工程",
              title: "架线工程",
              key: "1-1",
              first: "1",
              childContentList: []
            };
          }
          oldTypeList.value.forEach((item, index) => {
            let tempkey = index + 1;
            // 只显示1张图片，不显示视频
            let temp3 = {
              bgType: item.other != null && item.other != "" ? 1 : 0,
              bgimg: item.other,
              contenttext: "",
              key: "1-1-" + tempkey,
              medialist: [
                {
                  imgurl: item.other,
                  index: "1-1-" + tempkey + "-1",
                  three: "1-1-" + tempkey,
                  type: "img",
                  videourl: "null"
                }
              ],
              moreflag: false,
              second: "1-1",
              title: item.name
            };
            tempList2.childContentList.push(temp3);

          });
          tempList1.childMenuList.push(tempList2);
          menuList.value.push(tempList1);
          currentMenuList.value = menuList.value[0];
          activeKey.value = currentMenuList.value["childMenuList"][sub.value].key;
          subList.value.push("1-1");
        } else if (type.value == "towerstep") {
          // 有分级
          menuList.value = [];
          let tempList1 = {
            key: "1",
            label: "组塔施工",
            title: "组塔施工",
            childMenuList: []
          };

          oldTypeList.value.forEach((item, index) => {

            let tempkey = index + 1;
            let tempList2 = {
              label: item.name,
              title: item.name,
              key: "1-" + tempkey,
              first: "1",
              childContentList: []
            };
            subList.value.push("1-" + tempkey);
            if (item.childList != null && item.childList.length > 0) {

              item.childList.forEach((item2, index2) => {
                let tempkey2 = index2 + 1;
                // 只显示1张图片，不显示视频
                let temp3 = {
                  bgType: item2.other2 != null && item2.other2 != "" ? 1 : 0,
                  bgimg: item2.other2,
                  contenttext: "",
                  key: "1-" + tempkey + "-" + tempkey2,
                  medialist: [
                    {
                      imgurl: item2.other2,
                      index: "1-" + tempkey + "-" + tempkey2 + "-1",
                      three: "1-" + tempkey + "-" + tempkey2,
                      type: "img",
                      videourl: "null"
                    }
                  ],
                  moreflag: false,
                  second: "1-" + tempkey,
                  title: item2.name
                };
                tempList2.childContentList.push(temp3);

              })
            }
            tempList1.childMenuList.push(tempList2);
          });

          menuList.value.push(tempList1);
          currentMenuList.value = menuList.value[0];
          activeKey.value = currentMenuList.value["childMenuList"][sub.value].key;
        }
      }
    };

    // 点击返回按钮
    const clickBack = () => {
      if (flag.value == 1) {
        // 返回架线首页
        router.push({
          path: "/judgePage"
        });
      } else if (flag.value == 2) {
        // 返回工器具首页
        router.push({
          path: "/toolPage"
        });
      }

    };

    async function getparams() {
      if (key.value != undefined) {
        flag.value = 1;
        await getReportData(null).then(res => {
          // console.log("res==", res);
          menuList.value = res.diagnosis;
        });
      } else if (type.value != undefined) {
        flag.value = 2;
        let tempparams = new FormData();

        await getToolData(type.value, "select", tempparams).then(res => {
          // console.log("res==", res);
          oldTypeList.value = res.result;
        });
      }
    }

    // 点击查看详情
    const clickItem = tempItem => {

      if (flag.value == 1) {
        // 返回架线首页
        router.push({
          path: "/contentTextPage",
          query: {
            key: tempItem.key,
            type: 0,
          }
        });
      } else if (flag.value == 2) {
        // 返回工器具首页
        router.push({
          path: "/contentTextPage",
          query: {
            key: tempItem.key,
            type: type.value,
          }
        });
      }
    };

    // tab点击时存subindex
    const tabChange = (actKey) => {
      // console.log("change", actKey)
      subList.value.forEach((item, index) => {
        if (item == actKey) {
          subIndex.value = index.toString();
        }
      })
    }

    // 点击新增按钮
    const clickAdd = () => {
      let temppath = ""
      let tmepkey = "";
      if (flag.value == 1) {
        temppath = "/editPage";
        tmepkey = 'add-' + key.value;
      } else if (flag.value == 2) {
        temppath = "/editToolPage";
        tmepkey = 'add-' + type.value;
      }
      router.push({
        path: temppath,
        query: {
          key: tmepkey,
          sub: subIndex.value
        }
      })
    }

    onMounted(async () => {
      await getparams();
      getInfor();
    });

    return {
      router,
      searchValue,
      onSearch,
      menuList,
      key,
      currentMenuList,
      getInfor,
      clickBack,
      activeKey,
      clickItem,
      tabChange,
      subIndex,
      clickAdd
    };
  }
};
</script>
<style scoped lang="less">
.mainPage {
  height: 100vh;
  overflow-x: hidden;
}

.titleSpace {
  width: 100%;
  background: rgb(80, 146, 244);
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  height: 70px;

  .titleArea {
    height: 100%;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    margin: 0px 20px;

    .titleLogo {
      height: 20px;
    }

    .titleFont {
      color: #fff;
      font-size: 20px;
      padding-left: 10px;
    }
  }
}

.contentSpace {
  width: 100%;

  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  .searchInput {
    width: 90%;
    margin-top: 20px;

    :deep(.ant-input-affix-wrapper) {
      background: rgba(196, 196, 196, 0.25);
      border-radius: 20px;
      border: solid 0px #fff;
      width: calc(100% + 35px);
    }

    :deep(.ant-input-affix-wrapper .ant-input) {
      background: transparent;
      width: calc(100% - 55px);
    }

    :deep(.ant-input-affix-wrapper:focus) {}
  }

  :deep(.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button) {
    background: rgb(80, 146, 244);
    border-radius: 20px;
    font-size: 18px;
    z-index: 2;
  }

  .searchLogo {
    width: 15px;
    margin-right: 5px;
  }

  .menuSpace {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 5%;

    .contentTab {
      width: 100%;

      .tabTitle {
      }

      // 水平距离不够时去掉...图标
      :deep(.ant-tabs-nav-more) {
        height: 0px;
        overflow-y: hidden;
        pointer-events: none;
        position: absolute;
      }

      //下划线修改
      :deep(.ant-tabs-ink-bar) {
        background-color: rgb(80, 146, 244);
      }

      //选中颜色修改
      :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
        color: rgb(80, 146, 244);
      }

      //悬浮颜色修改
      :deep(.ant-tabs-tab:hover) {
        color: rgb(80, 146, 244);
      }

      :deep(.ant-tabs-tab) {
        margin: 0px 12px;
      }
    }

    .contentArea {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      overflow-x: hidden;
      width: calc(100% - 30px);
      margin: 0px 15px;

      .contentItemArea {
        width: 46%;
        margin: 0px 2%;
        height: inherit;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        .contentImg {
          width: 100%;
          height: 15vh;
          object-fit: cover;
          object-position: center top;
          background: rgb(235, 236, 236);
          border-radius: 5px;
          position: relative;
        }

        .contentText {}
      }
    }
  }
}

.insertButtonArea {
  position: fixed;
  bottom: 20px;
  right: 30px;
}
</style>