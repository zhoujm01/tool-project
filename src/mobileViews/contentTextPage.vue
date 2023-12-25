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
      <div>
        <a-carousel :dots="false" dot-position="bottom" arrows class="carouselArea">
          <template #prevArrow>
            <img style="left: 10px;z-index: 1;" :src="leftIcon" />
          </template>
          <template #nextArrow>
            <img style="right: 10px;z-index: 1;" :src="rightIcon" />
          </template>
          <div v-for="(item, index) in currentMenuList['medialist']" :key="index">
            <a-image style="width: 100%;max-height:200px;" :src="item.imgurl" :previewMask="false"
              v-if="item.type == 'img'" />
            <video :src="item.videourl" :id="'video' + item.index" v-if="item.type == 'video'"
              style="width: 100%;height:200px;" controls></video>
          </div>
        </a-carousel>
      </div>
      <div style="position:relative">
        <div class="contentArea">
          <div class="contentTitleArea">
            <div class="titleText">{{ currentMenuList["title"] }}</div>
            <div class="editArea" @click="clickEditButton">
              <img src="/picture/mobile/编辑2.png" style="width:15px;margin-right:5px" />
              <div>编辑</div>
            </div>
          </div>
          <div class="contentTextArea">{{ currentMenuList["contenttext"] }}</div>
        </div>
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

import { getReportData } from "../api/data";
import { getToolData } from "../api/tooldata";

import leftIcon from "../assets/svgs/左箭头.svg";
import rightIcon from "../assets/svgs/右箭头.svg";

export default {
  setup() {
    const router = useRouter();
    const key = ref(router.currentRoute.value.query.key);
    // 判断是诊断还是工器具的数据源
    const type = ref(router.currentRoute.value.query.type)
    const searchValue = ref();
    const onSearch = () => { };
    // 一级菜单key
    const activeKey = ref();
    const menuList = ref();

    const currentMenuList = ref([]);
    // 二级菜单顺序
    const subIndex = ref();

    // 点击返回按钮
    const clickBack = () => {
      if (type.value == "0") {
        // 架线
        let tempKey = "";
        tempKey = activeKey.value;

        router.push({
          path: "/contentPage",
          query: {
            key: tempKey,
            sub: subIndex.value ? subIndex.value : 0,
          }
        });
      } else {
        // 工器具
        let tempKey = "";
        tempKey = activeKey.value;

        router.push({
          path: "/contentPage",
          query: {
            type: type.value,
            sub: subIndex.value ? subIndex.value : 0,
          }
        });
      }

    };

    // 工器具数据
    const oldTypeList = ref();

    // current数据获取
    const getCurrentData = () => {
      menuList.value.forEach(item1 => {
        if (item1.childMenuList != null && item1.childMenuList.length > 0) {
          item1.childMenuList.forEach((item2, index2) => {
            if (
              item2.childContentList != null &&
              item2.childContentList.length > 0
            ) {
              item2.childContentList.forEach(item3 => {
                if (item3.key == key.value) {
                  currentMenuList.value = item3;
                  activeKey.value = item1.key;
                  subIndex.value = index2;
                  // 4级按key排序
                  let templist = [];
                  for (let i = 1; i <= item3.medialist.length; i++) {
                    let tempItem = item3.medialist.filter((item5) => {
                      let indexkey = item5.index.split("-");
                      return i == indexkey[3]
                    })
                    if (tempItem != null && tempItem.length > 0) {
                      templist.push(tempItem[0]);
                    }
                  }
                  currentMenuList.value["medialist"] = templist;
                }
              });
            }
          });
        }
      });
    }


    async function getparams() {
      if (type.value == "0") {
        // 架线
        await getReportData(null).then(res => {
          // console.log("res==", res);
          menuList.value = res.diagnosis;
          currentMenuList.value = [];
          getCurrentData();
          // // console.log("currentMenuList.value", currentMenuList.value, activeKey.value, subIndex.value)
        });
      } else {
        // 工器具
        let tempparams = new FormData();

        await getToolData(type.value, "select", tempparams).then(res => {
          // console.log("res==", res);
          oldTypeList.value = res.result;
          if (type.value == "basics" || type.value == "stringing") {
            // 无分级
            // 拼menulist
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
              let spec2 = item.spec != null && item.spec != "" ? "规格：" + item.spec + "\n" : "";
              let ps2 = item.ps != null && item.ps != "" ? "说明：" + item.ps + "\n" : "";
              let unit2 = item.unit != null && item.unit != "" ? "单位：" + item.unit + "\n" : "";
              let amt2 = item.amt != null && item.amt != "" ? "数量：" + item.amt + "\n" : "数量：0\n";

              let temp3 = {
                bgType: item.other != null && item.other != "" ? 1 : 0,
                bgimg: item.other,
                contenttext: `${spec2}${amt2}${unit2}${ps2}`,
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

            getCurrentData();
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
              if (item.childList != null && item.childList.length > 0) {

                item.childList.forEach((item2, index2) => {
                  let tempkey2 = index2 + 1;
                  // 只显示1张图片，不显示视频
                  let spec2 = item2.spec != null && item2.spec != "" ? "规格：" + item2.spec + "\n" : "";
                  let ps2 = item2.ps != null && item2.ps != "" ? "说明：" + item2.ps + "\n" : "";
                  let unit2 = item2.unit != null && item2.unit != "" ? "单位：" + item2.unit + "\n" : "";
                  let amt2 = item2.amt != null && item2.amt != "" ? "数量：" + item2.amt + "\n" : "数量：0\n";

                  let temp3 = {
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
            getCurrentData();

          }
          // // console.log("currentMenuList.value", currentMenuList.value, activeKey.value, subIndex.value)
        });
      }

    }

    // 点击视频
    const clickVideo = tempItem => {
      let videoElem = document.getElementById("video" + tempItem.index);

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoElem.requestFullscreen();
      }
    };

    // 点击编辑按钮
    const clickEditButton = () => {
      let temppath = ""
      if (type.value == "0") {
        temppath = "/editPage";
      } else {
        temppath = "/editToolPage";
      }
      router.push({
        path: temppath,
        query: {
          key: key.value,
          type: type.value
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
      leftIcon,
      rightIcon,
      clickVideo,
      clickEditButton
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
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
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
  position: relative;
}

.carouselArea {
  width: 100vw;
  height: 200px;
  background: rgb(235, 236, 236);
}

.contentArea {
  background: #fff;
  border-radius: 10px;
  margin-top: -10px;
  width: 100vw;
  height: calc(100vh - 260px);

  .contentTitleArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px 20px;
    height: 50px;

    .titleText {
      font-weight: 600;
    }

    .editArea {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      color: rgb(80, 146, 244);
    }
  }

  .contentTextArea {
    white-space: pre-line;
    text-align: left;
    margin: 0px 20px;
    overflow-x: auto;
    height: calc(100vh - 310px);
  }
}

</style>