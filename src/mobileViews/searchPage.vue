<template>
  <div class="mainPage">
    <!-- 手机端头部 -->
    <div class="titleSpace">
      <div class="titleArea">
        <img class="titleLogo" src="/picture/mobile/返回.png" @click="clickBack" />
        <div class="titleFont">搜索结果</div>
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
      <!-- 显示搜索结果区域 -->
      <div class="searchCardArea">
        <template v-for="(item2, index) in currentMenuList">
          <div class="searchItemArea" @click="searchCardClick(item2)">
            <span v-html="item2.title" class="searchTitle"></span>
            <div>
              <span v-html="item2.contenttext" class="searchContent"></span>
            </div>
          </div>
        </template>
      </div>
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
    const type = ref(router.currentRoute.value.query.type);
    const searchValue = ref();
    const onSearch = () => {
      getSearchResult();
    };
    const activeKey = ref();
    const menuList = ref();

    const currentMenuList = ref([]);

    // 获取搜索内容
    const getSearchResult = () => {
      if (searchValue.value != null && searchValue.value != "") {
        // 有搜索内容
        currentMenuList.value = [];
        // 传入关键词，返回搜索结果
        let Reg = new RegExp(searchValue.value, "g");
        let tempList = [];

        menuList.value.forEach((item, index) => {
          // 主菜单标题搜索
          if (item.title.includes(searchValue.value)) {
            //替换每一个相同字
            let title = item.title.replace(
              Reg,
              `<span style="color: red;font-weight:600">${searchValue.value}</span>`
            );
            let content1 = "";
            content1 = item.childMenuList
              ? item.childMenuList[0].title
                ? "> " + item.childMenuList[0].title
                : "> "
              : "> ";
            let tempItem = {
              key: item.key,
              index: index,
              flag: "main",
              title: title,
              contenttext: content1,
              type: "0",
            };
            if (type.value == "1") {
              // 工器具
              tempItem.type = item.type;
            }
            tempList.push(tempItem);
          }
          // 子菜单（标签页）标题搜索
          item.childMenuList.forEach((item2, index2) => {
            if (item2.title.includes(searchValue.value)) {
              //替换每一个相同字
              let title2 = item2.title.replace(
                Reg,
                `<span style="color: red;font-weight:600">${searchValue.value}</span>`
              );
              let content2 = "";
              if (
                item2.childContentList != null &&
                item2.childContentList.length > 0
              ) {
                content2 = "> " + item2.childContentList[0].title;
              } else {
                content2 = "> ";
              }
              let tempItem2 = {
                key: item2.key,
                index: index2,
                flag: "sub",
                title: title2,
                contenttext: content2,
                one: item.key,
                type: "0",
              };
              if (type.value == "1") {
                // 工器具
                tempItem2.type = item2.type;
              }
              tempList.push(tempItem2);
            }
            // 卡片内容搜索
            item2.childContentList?.forEach((item3, index3) => {
              // 卡片标题及卡片内容
              if (
                item3.title.includes(searchValue.value) ||
                item3.contenttext.includes(searchValue.value)
              ) {
                //替换每一个相同字
                let title3 = item3.title.replace(
                  Reg,
                  `<span style="color: red;font-weight:600">${searchValue.value}</span>`
                );
                //替换每一个相同字
                let contenttext = item3.contenttext.replace(
                  Reg,
                  `<span style="color: red;font-weight:600">${searchValue.value}</span>`
                );
                let tempItem3 = {
                  key: item3.key,
                  index: index3,
                  flag: "card",
                  title: title3,
                  contenttext: contenttext,
                  type: "0",
                };
                if (type.value == "1") {
                  // 工器具
                  tempItem3.type = item3.type;
                }
                tempList.push(tempItem3);
              }
            });
          });
        });
        currentMenuList.value = tempList;
        // console.log("searchlist:", currentMenuList);
      } else {
        // 无搜索内容
        currentMenuList.value = [];
      }
    };

    // 点击搜索结果card，跳转到对应位置
    const searchCardClick = (tempItem: any) => {
      // 一级菜单
      // 二级菜单
      // 三级菜单


      // console.log("tempItem", tempItem)
      // 点击跳转
      switch (tempItem.flag) {
        case "main":

          if (type.value == "0") {
            // 诊断
            router.push({
              path: "/contentPage",
              query: {
                key: tempItem.key,
                sub: 0
              }
            });
          } else {
            // 工器具
            router.push({
              path: "/contentPage",
              query: {
                type: tempItem.type,
                sub: 0
              }
            });
          }
          break;
        case "sub":
          if (type.value == "0") {
            // 诊断
            router.push({
              path: "/contentPage",
              query: {
                key: tempItem.one,
                sub: tempItem.index
              }
            });
          } else {
            // 工器具
            router.push({
              path: "/contentPage",
              query: {
                type: tempItem.type,
                sub: tempItem.index
              }
            });
          }
          break;
        case "card":
          router.push({
            path: "/contentTextPage",
            query: {
              key: tempItem.key,
              type: tempItem.type,
            }
          });
          break;
      }
    };

    // 点击返回按钮
    const clickBack = () => {
      router.back();
    };


    async function getparams() {
      // 测试
      searchValue.value = key.value;
      if (type.value == "0") {
        // 诊断
        await getReportData(null).then(res => {
          // console.log("res==", res);
          menuList.value = res.diagnosis;
          getSearchResult();
        });
      } else {
        // 工器具
        let temptypeList = ["basics", "towerstep", "stringing"];
        // 拼menulist
        menuList.value = [];
        await temptypeList.forEach(async (it1) => {
          let oldTypeList = [];
          await getToolData(it1, "select", new FormData()).then(res => {
            // console.log("res==", res);
            oldTypeList = res.result;
            if (it1 == "basics" || it1 == "stringing") {
              // 无分级
              let tempList1 = {
                key: "1",
                label: "",
                title: "",
                type: it1,
                childMenuList: []
              };
              let tempList2 = {
                label: "",
                title: "",
                key: "1-1",
                first: "1",
                type: it1,
                childContentList: []
              };
              if (it1 == "basics") {
                tempList1 = {
                  key: "1",
                  type: it1,
                  label: "基础施工",
                  title: "基础施工",
                  childMenuList: []
                };
                tempList2 = {
                  label: "基础施工",
                  title: "基础施工",
                  key: "1-1",
                  first: "1",
                  type: it1,
                  childContentList: []
                };
              } else if (it1 == "stringing") {
                tempList1 = {
                  key: "1",
                  label: "架线工程",
                  title: "架线工程",
                  type: it1,
                  childMenuList: []
                };
                tempList2 = {
                  label: "架线工程",
                  title: "架线工程",
                  key: "1-1",
                  first: "1",
                  type: it1,
                  childContentList: []
                };
              }
              oldTypeList.forEach((item, index) => {
                let tempkey = index + 1;
                // 只显示1张图片，不显示视频
                let spec2 = item.spec != null && item.spec != "" ? "规格：" + item.spec + "\n" : "";
                let ps2 = item.ps != null && item.ps != "" ? "说明：" + item.ps + "\n" : "";
                let unit2 = item.unit != null && item.unit != "" ? "单位：" + item.unit + "\n" : "";
                let amt2 = item.amt != null && item.amt != "" ? "数量：" + item.amt + "\n" : "数量：0\n";

                let temp3 = {
                  bgType: item.other != null && item.other != "" ? 1 : 0,
                  bgimg: item.other,
                  contenttext: `${spec2}${amt2}${unit2}${ps2}`,
                  key: "1-1-" + tempkey,
                  type: it1,
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

            } else if (it1 == "towerstep") {
              // 有分级
              let tempList1 = {
                type: it1,
                key: "1",
                label: "组塔施工",
                title: "组塔施工",
                childMenuList: []
              };

              oldTypeList.forEach((item, index) => {

                let tempkey = index + 1;
                let tempList2 = {
                  type: it1,
                  label: item.name,
                  title: item.name,
                  key: "1-" + tempkey,
                  first: "1",
                  childContentList: []
                };
                if (item.childList != null && item.childList.length > 0) {

                  item.childList.forEach((item2, index2) => {
                    let tempkey2 = index2 + 1;
                    // 只显示1张图片，不显示视频
                    let spec2 = item2.spec != null && item2.spec != "" ? "规格：" + item2.spec + "\n" : "";
                    let ps2 = item2.ps != null && item2.ps != "" ? "说明：" + item2.ps + "\n" : "";
                    let unit2 = item2.unit != null && item2.unit != "" ? "单位：" + item2.unit + "\n" : "";
                    let amt2 = item2.amt != null && item2.amt != "" ? "数量：" + item2.amt + "\n" : "数量：0\n";

                    let temp3 = {
                      type: it1,
                      bgType: item2.other2 != null && item2.other2 != "" ? 1 : 0,
                      bgimg: item2.other2,
                      contenttext: `${spec2}${amt2}${unit2}${ps2}`,
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
            }
          });
          getSearchResult();
        })
      }
    }

    // 点击查看详情
    const clickItem = tempItem => {
      router.push({
        path: "/contentTextPage",
        query: {
          key: tempItem.key
        }
      });
    };

    onMounted(async () => {
      await getparams();

    });

    return {
      router,
      searchValue,
      onSearch,
      menuList,
      key,
      currentMenuList,
      clickBack,
      activeKey,
      clickItem,
      getSearchResult,
      searchCardClick
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

  .searchCardArea {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 160px);

    overflow: auto;
    margin-top: 20px;
    padding-top: 0px;

    .searchItemArea {
      background: #fff;
      margin: 10px 20px;
      width: calc(100vw - 40px);
      text-align: left;

      .searchTitle {
        font-weight: 600;
        font-size: 20px;
        // 文本添加省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .searchContent {
        white-space: pre-line;
        width: 100%;
        margin: 0.5em 0px;
        // 文本添加省略号
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
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