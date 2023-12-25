<template>
  <div class="mainPage" id="mainPage">
    <!-- 手机端头部 -->
    <div class="titleSpace">
      <div class="titleArea">
        <img class="titleLogo" src="/picture/mobile/返回.png" @click="clickBack" />
        <div class="titleFont">新增类别</div>
      </div>
    </div>
    <!-- 主体部分 -->
    <div class="contentSpace">
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed" style="width: 100%;">
        <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请选择类别名称！' }]">
          <a-input v-model:value="formState.title" placeholder="请输入名称" disabled />
        </a-form-item>

        <a-form-item label="子类别" :rules="[{ required: true, message: '请输入子类别！' }]">
          <div style="width: 100%;display:flex;justify-content:space-between;margin-bottom:5px;margin-top:-10px;"
            v-if="state.selectedOneMenu">
            <div style="color: rgb(153, 153, 153);">已有类别：</div>
            <div style="width:calc(100% - 70px);display:flex;justify-content:space-between;"
              v-if="state.hasmore == true && state.moreflag == false">
              <div style="width:calc(100% - 70px);display:flex;flex-wrap: nowrap;overflow: hidden;">
                <template v-for="item1 in oldTwoMenuList">
                  <a-tag style="margin:2px">{{ item1.label }}</a-tag>
                </template>
              </div>
              <div>...</div>
              <a-tag style="margin:2px" @click="() => { state.moreflag = true }">&gt; 更多</a-tag>
            </div>
            <div style="width:calc(100% - 70px);display:flex;justify-content:space-between;"
              v-if="state.hasmore == true && state.moreflag == true">
              <div style="width:calc(100% - 0px);display:flex;flex-wrap: wrap;">
                <template v-for="item1 in oldTwoMenuList">
                  <a-tag style="margin:2px">{{ item1.label }}</a-tag>
                </template>
                <a-tag style="margin:2px" @click="() => { state.moreflag = false }">&lt; 收起</a-tag>
              </div>
            </div>
            <div style="width:calc(100% - 70px);display:flex;justify-content:space-between;" v-if="state.hasmore == false"
              id="tagNoMoreArea">
              <div style="display:flex;flex-wrap: wrap;" id="allTagArea">
                <template v-for="item1 in oldTwoMenuList">
                  <a-tag style="margin:2px">{{ item1.label }}</a-tag>
                </template>
              </div>
            </div>
          </div>
          <template v-for="item in formState.level">
            <div style="display: flex;align-items:center;margin-bottom:5px">
              <a-input v-model:value="item.name" placeholder="请输入子类别名称" allow-clear>
                <template #prefix>
                  <div style="display: flex;justify-content:center;align-items:center;margin-left: -5px;"
                    v-if="item.index != 0" @click="() => {
                      let nowIndex = -1;
                      formState.level.forEach((it, ind) => {
                        if (it.name == item.name) {
                          nowIndex = ind;
                        }
                      })
                      if (nowIndex != -1) {
                        formState.level.splice(nowIndex, 1);
                      }
                    }">
                    <img src="/picture/mobile/icon_删除2.png" style="width: 20px;" />
                  </div>
                  <div style="display: flex;justify-content:center;align-items:center;margin-left: -5px;"
                    v-if="item.index == 0" @click="() => {
                      formState.level.push({ name: null, index: formState.level.length })
                    }">
                    <img src="/picture/mobile/icon_添加2.png" style="width: 20px;" />
                  </div>
                </template>
              </a-input>
            </div>
          </template>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
          <a-button type="primary" class="submitButton" @click="clickSubmit">提交</a-button>
        </a-form-item>
      </a-form>
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

import {
  getReportData,
  deleteImg,
  changeReportData,
  changeData
} from "../api/data";
import { getToolData } from "../api/tooldata";
import { v4 as uuidV4 } from "uuid"
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/index'
import { defineComponent } from 'vue';


import leftIcon from "../assets/svgs/左箭头.svg";
import rightIcon from "../assets/svgs/右箭头.svg";

import { PlayCircleFilled } from "@ant-design/icons-vue";
import { app } from "../main";
import { context } from "ant-design-vue/es/vc-image/src/PreviewGroup";



export default defineComponent({
  components: {
    PlayCircleFilled
  },
  setup() {
    // 消息配置
    message.config({
      top: `80px`,
      getContainer: () => document.getElementById("mainPage")
    })

    const router = useRouter();
    const key = ref(router.currentRoute.value.query.key);
    const searchValue = ref();
    const onSearch = () => { };
    const activeKey = ref();
    const menuList = ref();

    const selectList = ref();

    const currentMenuList = ref([]);

    const appSettings = app.config.globalProperties.$appSettings;
    const baseUrl = ref(appSettings.restUrl + "uploadimg");

    const keyList = ref([]);

    // 已有的二级菜单名称
    const oldTwoMenuList = ref([]);

    // 已有子类别显示
    const state = ref({
      moreflag: false,
      hasmore: false,
      selectedOneMenu: false
    });

    // 点击返回按钮
    const clickBack = () => {
      router.push({
        path: "/toolPage"
      });
    };

    async function getparams() {
      // 只能增加towerstep的子类别，不能改图标
      selectList.value = [];
      let templist = {
        value: "towerstep",
        label: "组塔施工",
        children: [],
      }
      let list = [];
      formState.title = "组塔施工";
      await getToolData("towerstep", "select", new FormData()).then(res => {
        list = res.result;
        list.forEach((item) => {
          let tempitem = {
            value: item.id,
            label: item.name,
          }
          templist.children.push(tempitem);
        })
        selectList.value.push(templist);
        selectOneMenu(formState.title, selectList.value[0]);
      })
    }

    // 表单--start

    interface FormState {
      title: string;
      level: Array<any>;
      content: string;
      fileList: Array<any>;
      icon: string;
      type: string;
      oneMenuName: string;
    }

    const formState = reactive<FormState>({
      title: null,
      level: [{ name: null, index: 0 }],
      content: null,
      fileList: [],
      icon: "mobileIcon1",
      type: "add",
      oneMenuName: ""
    });


    // 重置表单数据
    const refreshForm = async () => {
      formState.title = null;
      formState.level = [{ name: null, index: 0 }];
      formState.content = null;
      formState.fileList = [];
      formState.icon = "mobileIcon1";
      formState.type = "add";
      formState.oneMenuName = "";
      // 重新获取下拉框数据
      await getparams();
    }

    const onFinish = (values: any) => {
      // console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
      // console.log("Failed:", errorInfo);
    };

    const clickSubmit = async () => {
      // console.log("form", formState)

      // 判断二级菜单名称是否重复
      if (formState.level != null && formState.level.length > 0) {
        let templist1 = formState.level.filter((it1) => {
          return it1.name != null && it1.name != "";
        })
        if (templist1 != null && templist1.length > 0) {
          let sameflag = false;
          templist1.forEach(item1 => {
            if (item1.name != null && item1.name != "") {
              // 新增名称与已有名称不重复
              let tmeplist = oldTwoMenuList.value.filter(item2 => {
                return item1.name == item2.label;
              });
              // 新增名称不重复
              let templist3 = templist1.filter(item2 => {
                return item1.name == item2.name && item2.index != item1.index;
              })
              if ((tmeplist != null && tmeplist.length > 0) || (templist3 != null && templist3.length > 0)) {
                sameflag = true;
              }
            }
          });
          setTimeout(async () => {
            if (sameflag != true) {
              // 子类别名称不重复
              // 新增二级
              // 获取二级key
              let i = 0;
              templist1.forEach(async (item2) => {
                let tempparams = new FormData();
                tempparams.append("id", uuidV4());
                tempparams.append("name", item2.name);
                await getToolData("towerstep", "insert", tempparams).then(res => {
                  if (res.code == 200) {
                    i++;
                    // 新增成功
                    if (i == templist1.length) {
                      // 全部新增成功
                      message.success("新增成功")
                      // console.log("新增成功:", res);
                      clickBack();
                    }
                  } else {
                    // 新增失败
                    // console.log("新增数据-失败:", res);
                    message.error("新增失败")
                    refreshForm();
                  }
                })
              })

              
            } else if (sameflag == true) {
              // 子类别名称重复
              message.error('子类别名称重复，请修改！');
            }
          });

        } else {
          // 无新增子类别
          message.error("请输入子类别！")
        }
      } else {
        // 无新增子类别
        message.error("请输入子类别！")
        // // console.log("修改成功:", res);
      }

    };
    // 表单--end

    // 可输入一级菜单名称
    const filterOption = (input, option) => {
      formState.title = input;
      formState.type = "add";
      oldTwoMenuList.value = [];
      state.value.selectedOneMenu = false;
      state.value.hasmore = false;
      state.value.moreflag = false;
      if (option.label == input) {
        setTimeout(() => {
          selectOneMenu(input, option);
        })

      }
      return option.label.indexOf(input) != -1;
    };

    //  根据选中的一级菜单获取二级菜单
    const selectOneMenu = (value, option) => {
      // // console.log("selectOneMenu", value, option);
      formState.type = "edit";
      oldTwoMenuList.value = option.children;
      state.value.selectedOneMenu = true;
      state.value.hasmore = false;
      formState.icon = option.mobileIcon;
      formState.oneMenuName = option.label;

      setTimeout(() => {
        let temp = document.getElementById("tagNoMoreArea");
        let temp2 = document.getElementById("allTagArea");
        let width = temp2.clientWidth + 70;
        if (width > temp.clientWidth) {
          state.value.hasmore = true;
          state.value.moreflag = false;
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
      formState,
      onFinish,
      onFinishFailed,
      baseUrl,
      clickSubmit,
      selectList,
      mobileIcon1,
      mobileIcon2,
      mobileIcon3,
      mobileIcon4,
      mobileIcon5,
      oldTwoMenuList,
      state,
      filterOption,
      selectOneMenu,
    };
  }
});
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
      width: calc(100% - 60px);
      text-align: center;
    }
  }
}

.contentSpace {
  width: calc(100% - 40px);

  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  position: relative;
  margin: 10px 20px;

  .submitButton {
    width: calc(100% - 40px);
    position: fixed;
    bottom: 0px;
    left: 20px;
    height: 50px;
    background: rgb(80, 146, 244);
    font-size: 20px;
  }
}

.carouselArea {
  width: 100vw;
  height: 200px;
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

.uploadButtonArea {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: rgba(153, 153, 153, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0px;
  top: 0px;
  margin: 10px;
  margin-top: 13px;
}

.uploadItemImgArea {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: rgba(153, 153, 153, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.uploadItemArea {
  width: 100px;
  height: 100px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

:deep(.ant-upload-list-item-container .ant-motion-collapse) {
  max-width: 120px;
  max-height: 110px;
}

:deep(.ant-upload-wrapper .ant-upload-list .ant-upload-list-item-container) {
  max-width: 120px;
  max-height: 110px;
}

:deep(.ant-upload-wrapper .ant-upload-list) {
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  min-width: 240px;
  margin-top: -15px;
}

:deep(.ant-upload .ant-upload-select .ant-upload-select-text) {
  max-width: 120px;
  max-height: 120px;
}

// 图标单选框
.radioArea {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


</style>