<template>
  <div class="mainPage">
    <!-- 手机端头部 -->
    <div class="titleSpace">
      <div class="titleArea" @click="() => {
        router.push({
          path: '/',
        });
      }">
        <img class="titleLogo" src="/picture/mobile/logo_诊断.png" />
        <div class="titleFont">{{ titleText }}</div>
      </div>
    </div>
    <!-- 主体部分 -->
    <div class="contentSpace">
      <!-- 搜索框 -->
      <a-input-search v-model:value="searchValue" placeholder="输入关键词" enter-button="搜索" size="large" @search="onSearch"
        class="searchInput">
        <template #prefix>
          <img class="searchLogo" src="/picture/mobile/icon_搜索.png" />
        </template>
      </a-input-search>
      <!-- 显示菜单按钮区域 -->
      <div class="menuSpace">
        <!-- 菜单按钮 -->
        <template v-for="item in menuList">
          <div class="menuItemArea" @click="clickMenuItem(item)">
            <img class="menuLogo" :src="item.mobileIcon" />
            <div class="menuTitle">{{ item.title }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="insertButtonArea" @click="() => { router.push('/addMenuPage') }">
      <img src="../assets/svgs/添加按钮.svg" style="width: 50px;" />
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

export default {
  setup() {
    const router = useRouter();
    const searchValue = ref();
    const onSearch = () => {
      router.push({
        path: "/searchPage",
        query: {
          key: searchValue.value,
          type:0,
        }
      });
    };
    const titleText = "架线专家预控及诊断";
    const menuList = ref();

    const clickMenuItem = (currtentItem: any) => {
      router.push({
        path: "/contentPage",
        query: {
          key: currtentItem.key,
          sub: 0
        }
      });
    };
    async function getparams() {
      await getReportData(null).then(res => {
        // // console.log("res==", res);
        menuList.value = res.diagnosis;
        if (menuList.value != null && menuList.value.length > 0) {
          menuList.value.forEach(item => {
            switch (item.mobileIcon) {
              case "mobileIcon1":
                item.mobileIcon = mobileIcon1;
                break;
              case "mobileIcon2":
                item.mobileIcon = mobileIcon2;
                break;
              case "mobileIcon3":
                item.mobileIcon = mobileIcon3;
                break;
              case "mobileIcon4":
                item.mobileIcon = mobileIcon4;
                break;
              case "mobileIcon5":
                item.mobileIcon = mobileIcon5;
                break;
            }
          });
        }
      });
    }
    onMounted(() => {
      getparams();
    });

    return {
      router,
      searchValue,
      onSearch,
      menuList,
      clickMenuItem,
      titleText
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
  height: 50vh;
  width: 100%;
  background: url("/picture/mobile/小程序banner背景.png");
  background-repeat: no-repeat;
  background-size: cover;

  .titleArea {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;

    .titleLogo {
      width: 30px;
      height: 30px;
    }

    .titleFont {
      font-family: "YouSheBiaoTiHei";
      color: #fff;
      font-size: 20px;
      padding-left: 10px;
    }
  }
}

.contentSpace {
  height: 70vh;
  width: 90%;
  margin-left: 5%;
  position: absolute;
  bottom: 0px;
  left: 0px;
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
    background: rgb(0, 190, 201);
    border-radius: 20px;
    font-size: 18px;
    z-index: 2;
  }

  .searchLogo {
    width: 15px;
    margin-right: 5px;
  }

  .menuSpace {
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 5%;

    .menuItemArea {
      width: 20%;
      margin: 2.5%;

      .menuLogo {
        width: 75%;
      }

      .menuTitle {}
    }
  }
}

.insertButtonArea {
  position: fixed;
  bottom: 20px;
  right: 30px;
}
</style>