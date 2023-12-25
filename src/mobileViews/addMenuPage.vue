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
        <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请输入名称！' }]">
          <a-select v-model:value="formState.title" style="width: 100%;text-align:left;" placeholder="请输入名称"
            :options="selectList" :filter-option="filterOption" show-search allowClear notFoundContent :showArrow="false"
            @select="selectOneMenu"></a-select>
        </a-form-item>

        <a-form-item label="子类别" :rules="[{ required: formState.type == 'add' ? true : false, message: '请输入子类别！' }]">
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
                    <img src="/picture/mobile/icon_添加.png" style="width: 20px;" />
                  </div>
                </template>
              </a-input>
            </div>
          </template>
        </a-form-item>

        <a-form-item label="图标" name="content" :rules="[{ required: true, message: '请选择图标！' }]">
          <a-radio-group v-model:value="formState.icon" name="radioGroup"
            style="width:95%;display:flex;justify-content:center;align-items:center;">
            <div @click="() => { formState.icon = 'mobileIcon1' }" class="radioArea">
              <img :src="mobileIcon1" style="width: 75%;" />
              <a-radio value="mobileIcon1" style="margin-right:0px"></a-radio>
            </div>
            <div @click="() => { formState.icon = 'mobileIcon2' }" class="radioArea">
              <img :src="mobileIcon2" style="width: 75%;" />
              <a-radio value="mobileIcon2" style="margin-right:0px"></a-radio>
            </div>
            <div @click="() => { formState.icon = 'mobileIcon3' }" class="radioArea">
              <img :src="mobileIcon3" style="width: 75%;" />
              <a-radio value="mobileIcon3" style="margin-right:0px"></a-radio>
            </div>
            <div @click="() => { formState.icon = 'mobileIcon4' }" class="radioArea">
              <img :src="mobileIcon4" style="width: 75%;" />
              <a-radio value="mobileIcon4" style="margin-right:0px"></a-radio>
            </div>
            <div @click="() => { formState.icon = 'mobileIcon5' }" class="radioArea">
              <img :src="mobileIcon5" style="width: 75%;" />
              <a-radio value="mobileIcon5" style="margin-right:0px"></a-radio>
            </div>
          </a-radio-group>
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
        path: "/judgePage"
      });
      
    };

    async function getparams() {
      await getReportData(null).then(res => {
        // console.log("res==", res);
        menuList.value = res.diagnosis;
        // 获取当前显示数据
        currentMenuList.value = [];
        keyList.value = [];
        menuList.value.forEach(item1 => {
          if (item1.childMenuList != null && item1.childMenuList.length > 0) {
            item1.childMenuList.forEach(item2 => {
              if (
                item2.childContentList != null &&
                item2.childContentList.length > 0
              ) {
                item2.childContentList.forEach(item3 => {
                  keyList.value.push(item3.key);
                  
                });
              }
            });
          }
        });

        // 获取一级、二级菜单数据
        selectList.value = [];
        menuList.value.forEach(item => {
          let tempItem = {
            value: item.key,
            label: item.title,
            children: [],
            mobileIcon: item.mobileIcon
          };
          if (item.childMenuList != null && item.childMenuList.length > 0) {
            tempItem.children = [];
            item.childMenuList.forEach(item2 => {
              let tempChild = {
                value: item2.key,
                label: item2.title
              };
              tempItem.children.push(tempChild);
            });
          }
          selectList.value.push(tempItem);
        });
      });
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
      if (formState.title != null && formState.title != "") {
        // 一级类别名称不为空
        if (formState.type == "edit") {
          // 已有一级菜单 // 新增二级菜单
          // 修改一级图标
          let tempform1 = new FormData();
          tempform1.append("icon", formState.icon);
          tempform1.append("mobileicon", formState.icon);
          tempform1.append("label", formState.oneMenuName);
          tempform1.append("title", formState.oneMenuName);

          await changeReportData(formState.title, "set", tempform1).then(
            async res => {
              if (res.code == 200) {
                // console.log("修改一级数据-成功:", res);
                // 判断二级菜单名称是否重复
                if (formState.level != null && formState.level.length > 0) {
                  let templist1 = formState.level.filter((it1) => {
                    return it1.name != null && it1.name != "";
                  })
                  if (templist1 != null && templist1.length > 0) {
                    let sameflag = false;
                    formState.level.forEach(item1 => {
                      if (item1.name != null && item1.name != "") {
                        // 新增名称与已有名称不重复
                        let tmeplist = oldTwoMenuList.value.filter(item2 => {
                          return item1.name == item2.label;
                        });
                        // 新增名称不重复
                        let templist3 = formState.level.filter(item2 => {
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
                        let temp = new FormData();
                        await changeData("second", "select", temp).then(async res1 => {
                          if (res1.success == 0) {
                            let maxKey = 0;
                            if (res1.data != null && res1.data.length > 0) {
                              res1.data.forEach(item1 => {
                                if (item1.first == formState.title) {
                                  let twokey = item1.key.split("-")[1];
                                  let currentKey = parseInt(twokey);
                                  if (currentKey > maxKey) {
                                    maxKey = currentKey;
                                  }
                                }
                              });
                            }
                            let newKey = maxKey;

                            // 添加新的2级数据
                            let templist4 = formState.level.filter((it) => {
                              return it.name != null && it.name != "";
                            })
                            if (templist4 != null && templist4.length > 0) {
                              let i = 0;
                              let len = 0;
                              templist4.forEach(async (item2, index2) => {
                                i++;
                                let nowkey2 = newKey + i;
                                let key2 = formState.title + "-" + nowkey2;
                                let tempform2 = new FormData();

                                tempform2.append("label", item2.name);
                                tempform2.append("first", formState.title);
                                tempform2.append("title", item2.name);
                                await changeReportData(key2, "insert", tempform2)
                                  .then(async res => {
                                    if (res.code == 200) {
                                      len++;
                                      // console.log("新增2级数据-成功:", res);
                                      if (len == templist4.length) {
                                        message.success("新增成功")
                                        // console.log("新增成功:", res);
                                        clickBack();
                                      }
                                    } else {
                                      // console.log("新增2级数据-失败:", res);
                                      message.error("新增失败")
                                      refreshForm();
                                    }
                                  })
                                  .catch(e => {
                                    // console.log("修改2级数据-失败:", e);
                                    message.error("新增失败")
                                    refreshForm();
                                  });
                              });
                            } else {
                              // 无新增子类别
                              message.success("修改成功")
                              // console.log("修改成功:", res);
                              clickBack();
                            }

                          } else {
                            // console.log("获取2级数据-失败:", res);
                            message.error("修改失败")
                            refreshForm();
                          }
                        });
                      } else if (sameflag == true) {
                        // 子类别名称重复
                        message.error('子类别名称重复，请修改！');
                      }
                    });
                  } else {
                    // 无新增子类别
                    message.success("修改成功")
                    // console.log("修改成功:", res);
                    clickBack();
                  }
                } else {
                  // 无新增子类别
                  message.success("修改成功")
                  // console.log("修改成功:", res);
                  clickBack();
                }
              } else {
                // console.log("修改一级数据-失败:", res);
                message.error("修改失败")
                refreshForm();
              }
            }
          );
        } else if (formState.type == "add") {
          // 已有一级菜单 // 新增二级菜单
          // 判断子类别名称是否重复
          if (formState.level != null && formState.level.length > 0) {
            let templist1 = formState.level.filter((it1) => {
              return it1.name != null && it1.name != "";
            })
            if (templist1 != null && templist1.length > 0) {

              let sameflag = false;
              formState.level.forEach(item1 => {
                if (item1.name != null && item1.name != "") {
                  // 新增名称不重复
                  let templist3 = formState.level.filter(item2 => {
                    return item1.name == item2.name && item2.index != item1.index;
                  })
                  if (templist3 != null && templist3.length > 0) {
                    sameflag = true;
                  }
                }
              });
              setTimeout(async () => {
                if (sameflag != true) {
                  // 子类别名称不重复

                  // 获取一级菜单key
                  let temp = new FormData();
                  await changeData("first", "select", temp).then(async res1 => {
                    if (res1.success == 0) {
                      let maxKey = 0;
                      if (res1.data != null && res1.data.length > 0) {
                        res1.data.forEach(item1 => {
                          let currentKey = parseInt(item1.key);
                          if (currentKey > maxKey) {
                            maxKey = currentKey;
                          }
                        });
                      }
                      let newKey = maxKey + 1;
                      // 新增一级
                      let tempform1 = new FormData();

                      tempform1.append("icon", formState.icon);
                      tempform1.append("label", formState.title);
                      tempform1.append("mobileicon", formState.icon);
                      tempform1.append("title", formState.title);
                      await changeReportData(newKey, "insert", tempform1)
                        .then(async res => {
                          if (res.code == 200) {
                            // console.log("新增一级数据-成功:", res);
                            // 新增二级

                            // 新增二级
                            let templist4 = formState.level.filter((it) => {
                              return it.name != null && it.name != "";
                            })
                            if (templist4 != null && templist4.length > 0) {
                              let i = 0;
                              let len = 0;
                              templist4.forEach(async (item2, index2) => {
                                i++;
                                let nowkey2 = i;
                                let key2 = newKey + "-" + nowkey2;
                                let tempform2 = new FormData();

                                tempform2.append("label", item2.name);
                                tempform2.append("first", newKey.toString());
                                tempform2.append("title", item2.name);
                                await changeReportData(key2, "insert", tempform2)
                                  .then(async res => {
                                    if (res.code == 200) {
                                      len++;
                                      // console.log("修改2级数据-成功:", res);
                                      if (len == templist4.length) {
                                        message.success("新增成功")
                                        // console.log("新增成功:", res);
                                        clickBack();
                                      }
                                    } else {
                                      // console.log("修改2级数据-失败:", res);
                                      message.error("新增失败")
                                      refreshForm();
                                    }
                                  })
                                  .catch(e => {
                                    // console.log("修改2级数据-失败:", e);
                                    message.error("新增失败")
                                    refreshForm();
                                  });
                              });
                            } else {
                              // 无新增子类别
                              message.success("新增成功")
                              // console.log("新增成功:", res);
                              clickBack();
                            }
                          } else {
                            // console.log("新增一级数据-失败:", res);
                            message.error("新增失败")
                            refreshForm();
                          }
                        })
                        .catch(err => {
                          // console.log("新增一级数据-失败", err);
                          message.error("新增失败")
                          refreshForm();
                        });
                    } else {
                      // 获取1级数据失败
                      // console.log("获取一级数据-失败", res1);
                      message.error("新增失败")
                      refreshForm();
                    }
                  }).catch((err) => {
                    // 获取1级数据失败
                    // console.log("获取一级数据-失败", err);
                    message.error("新增失败")
                    refreshForm();
                  });
                } else if (sameflag == true) {
                  // 子类别名称重复
                  message.error('子类别名称重复，请修改！');
                }
              });
            } else {
              // 无新增子类别
              message.error('子类别名称不能为空！');
            }
          } else {
            // 无新增子类别
            message.error('子类别名称不能为空！');
          }
        }
      } else {
        // 一级类别名称为空
        message.error('名称不能为空！');
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
  background: rgb(0, 190, 201);
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
    background: rgb(0, 190, 201);
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
      color: rgb(0, 190, 201);
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