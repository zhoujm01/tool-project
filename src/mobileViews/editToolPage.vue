<template>
  <!-- 工器具内容编辑、新增页面 -->
  <div class="mainPage" id="mainPage">
    <!-- 手机端头部 -->
    <div class="titleSpace">
      <div class="titleArea">
        <img class="titleLogo" src="/picture/mobile/返回.png" @click="clickBack" />
        <div class="titleFont">{{ titleType == 1 ? "详情编辑" : titleType == 2 ? "新增内容" : "" }}</div>
      </div>
    </div>
    <!-- 主体部分 -->
    <div class="contentSpace">
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed" style="width: 100%;">
        <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请输入名称！' }]">
          <a-input v-model:value="formState.title" placeholder="请输入名称" />
        </a-form-item>

        <a-form-item label="类别" name="level" :rules="[{ required: true, message: '请选择类别！' }]">
          <a-cascader v-model:value="formState.level" :options="selectList" placeholder="请选择类别"
            :display-render="showLabel" style="text-align: left;"></a-cascader>
        </a-form-item>

        <a-form-item label="规格" name="spec">
          <a-input v-model:value="formState.spec" placeholder="请输入规格" />
        </a-form-item>
        <a-form-item label="数量" name="amt">
          <a-input v-model:value="formState.amt" placeholder="请输入数量" />
        </a-form-item>
        <a-form-item label="单位" name="unit">
          <a-input v-model:value="formState.unit" placeholder="请输入单位" />
        </a-form-item>
        <a-form-item label="说明" name="ps">
          <a-textarea v-model:value="formState.ps" placeholder="请输入说明" :auto-size="{ minRows: 1, maxRows: 10 }" />
        </a-form-item>

        <a-form-item name="上传" :wrapper-col="{ offset: 0, span: 24 }" style="height:100px;margin-bottom: 30px;">
          <div class="clearfix" style="margin-bottom:60px">
            <a-upload v-model:file-list="formState.fileList" :action="baseUrl" @preview="handlePreview"
              @remove="deleteFile" accept=".png, .jpg, .jpeg, .svg" @change="handleVideoChange" :multiple="false"
              :max-count="1" :openFileDialogOnClick="openFlag">
              <div class="uploadButtonArea" @click="clickAdd">
                <img src="/picture/mobile/icon_添加2.png" style="width: 20px;" />
                <div style="color:rgb(80, 146, 244);margin-top:5px">添加图片</div>
              </div>
              <template #itemRender="{ file, actions }" class="uploadListArea">
                <a-space class="uploadItemArea">
                  <img class="uploadItemImgArea" :src="file.preview" v-if="file.type.indexOf('image') != -1"
                    @click="actions.preview" :id="file.uid" />
                  <div class="uploadItemImgArea" v-if="file.type.indexOf('video') != -1" :id="file.uid"
                    @click="actions.preview">
                    <video alt="example" style="width: 100%;height:100%;" :src="file.preview" :autoplay="false"></video>
                    <PlayCircleFilled
                      style="fontSize:35px;color:rgb(80, 146, 244);position: absolute;background: white;border-radius: 25px;" />
                  </div>

                  <img src="/picture/mobile/icon_删除.png"
                    style="width: 35px;position:absolute;top:-15px;right:-15px;z-index:999;" @click="actions.remove"
                    v-show="file.showDeleteFlag" />
                </a-space>
              </template>
            </a-upload>
            <a-modal v-if="fileType == 'image'" :footer="null" @cancel="handleCancel" :open="previewVisible" title="图片">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
            <a-modal v-if="fileType == 'video'" :footer="null" @cancel="handleCancel" :open="previewVisible" title="视频">
              <video alt="example" style="width: 100%" :src="previewImage" controls :autoplay="true"
                id="modalVideoId"></video>
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
          <a-button type="primary" class="submitButton" @click="clickSubmit()">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive, watch, h, onMounted, onUnmounted, nextTick } from "vue";
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

import leftIcon from "../assets/svgs/左箭头.svg";
import rightIcon from "../assets/svgs/右箭头.svg";

import { PlayCircleFilled } from "@ant-design/icons-vue";
import { app } from "../main";

import { message } from "ant-design-vue";
import type { UploadProps } from 'ant-design-vue';
import { v4 as uuidV4 } from "uuid"


export default {
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
    // 判断是诊断还是工器具的数据源
    const type = ref(router.currentRoute.value.query.type)
    const sub = ref(router.currentRoute.value.query.sub)

    const searchValue = ref();
    const onSearch = () => { };
    const activeKey = ref();
    const menuList = ref();

    const selectList = ref();

    const currentMenuList = ref([]);

    const appSettings = app.config.globalProperties.$appSettings;
    const baseUrl = ref(appSettings.restUrl + "uploadimg");



    const titleType = ref();
    const keyList = ref([]);

    // 点击返回按钮
    const clickBack = () => {
      if (titleType.value == 1) {
        router.push({
          path: "/contentTextPage",
          query: {
            key: key.value,
            type: type.value
          }
        });
      } else if (titleType.value == 2) {
        router.push({
          path: "/contentPage",
          query: {
            type: type.value,
            sub: sub.value
          }
        });
      }
    };

    // 工器具返回值数据
    const oldTypeList = ref();

    async function getparams() {

      let tempparams = new FormData();
      if (key.value.indexOf("add") != -1) {
        // 新增
        type.value = key.value.toString().split("-")[1];
      }

      await getToolData(type.value, "select", tempparams).then(res => {
        // console.log("res==", res);
        oldTypeList.value = res.result;
        if (type.value == "basics" || type.value == "stringing") {
          // 无分级
          // 拼menulist
          menuList.value = [];
          let tempList1 = {
            id: 0,
            key: "1",
            label: "",
            title: "",
            childMenuList: []
          };
          let tempList2 = {
            id: 0,
            label: "",
            title: "",
            key: "1-1",
            first: "1",
            childContentList: []
          };
          if (type.value == "basics") {
            tempList1 = {
              id: 0,
              key: "1",
              label: "基础施工",
              title: "基础施工",
              childMenuList: []
            };
            tempList2 = {
              id: 0,
              label: "基础施工",
              title: "基础施工",
              key: "1-1",
              first: "1",
              childContentList: []
            };
          } else if (type.value == "stringing") {
            tempList1 = {
              id: 0,
              key: "1",
              label: "架线工程",
              title: "架线工程",
              childMenuList: []
            };
            tempList2 = {
              id: 0,
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
              id: item.id,
              bgType: item.other != null && item.other != "" ? 1 : 0,
              bgimg: item.other,
              spec: item.spec,
              ps: item.ps,
              unit: item.unit,
              amt: item.amt,
              key: "1-1-" + tempkey,
              medialist: [],
              moreflag: false,
              second: "1-1",
              title: item.name
            };
            // 获取img
            if (item.other != null && item.other != "") {
              let tempmedia = {
                imgurl: item.other,
                index: "1-1-" + tempkey + "-1",
                three: "1-1-" + tempkey,
                type: "img",
                videourl: "null"
              }
              temp3.medialist.push(tempmedia);
            }
            tempList2.childContentList.push(temp3);
          });
          tempList1.childMenuList.push(tempList2);
          menuList.value.push(tempList1);

        } else if (type.value == "towerstep") {
          // 有分级
          menuList.value = [];
          let tempList1 = {
            id: 0,
            key: "1",
            label: "组塔施工",
            title: "组塔施工",
            childMenuList: []
          };

          oldTypeList.value.forEach((item, index) => {

            let tempkey = index + 1;
            let tempList2 = {
              id: item.id,
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

                let temp3 = {
                  id: item2.id,
                  other1: item2.other1,
                  bgType: item2.other2 != null && item2.other2 != "" ? 1 : 0,
                  bgimg: item2.other2,
                  spec: item2.spec,
                  ps: item2.ps,
                  unit: item2.unit,
                  amt: item2.amt,
                  key: "1-" + tempkey + "-" + tempkey2,
                  medialist: [],
                  moreflag: false,
                  second: "1-" + tempkey,
                  title: item2.name
                };
                // 获取img
                if (item2.other2 != null && item2.other2 != "") {
                  let tempmedia = {
                    imgurl: item2.other2,
                    index: "1-" + tempkey + "-" + tempkey2 + "-1",
                    three: "1-" + tempkey + "-" + tempkey2,
                    type: "img",
                    videourl: "null"
                  }
                  temp3.medialist.push(tempmedia);
                }
                tempList2.childContentList.push(temp3);

              })
            }
            tempList1.childMenuList.push(tempList2);
          });

          menuList.value.push(tempList1);


        }
        // 获取当前显示数据
        currentMenuList.value = [];
        keyList.value = [];
        changeMenuList();
        // // console.log("currentMenuList.value", currentMenuList.value, activeKey.value, subIndex.value)
      });
    }

    // menulist数据处理
    const changeMenuList = () => {

      if (key.value.indexOf("add") != -1) {
        // 新增详情数据
        titleType.value = 2;
        currentMenuList.value = [];
        activeKey.value = key.value.toString().substring(4);
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
        // console.log("keylist==", keyList);
      } else {
        // 修改详情数据
        titleType.value = 1;
        menuList.value.forEach(item1 => {
          if (item1.childMenuList != null && item1.childMenuList.length > 0) {
            item1.childMenuList.forEach(item2 => {
              if (
                item2.childContentList != null &&
                item2.childContentList.length > 0
              ) {
                item2.childContentList.forEach(item3 => {
                  if (item3.key == key.value) {
                    currentMenuList.value = item3;
                    activeKey.value = item1.key;
                    // 给form赋值
                    formState.title = item3.title;
                    formState.level = [item1.id, item2.id];
                    formState.spec = item3.spec;
                    formState.amt = item3.amt;
                    formState.unit = item3.unit;
                    formState.ps = item3.ps;
                    formState.fileList = [];

                    if (
                      item3.medialist != null &&
                      item3.medialist.length > 0
                    ) {
                      let templist = [];

                      for (let i = 1; i <= item3.medialist.length; i++) {
                        let tempItem = item3.medialist.filter((item5) => {
                          let indexkey = item5.index.split("-");
                          return i == indexkey[3]
                        })
                        if (tempItem != null && tempItem.length > 0) {
                          let tempFile = {
                            preview: "",
                            type: "",
                            uid: tempItem[0].index,
                            showDeleteFlag: false
                          };
                          if (tempItem[0].type == "img") {
                            tempFile.preview = tempItem[0].imgurl;
                            tempFile.type = "image";
                          } else if (tempItem[0].type == "video") {
                            tempFile.preview = tempItem[0].videourl;
                            tempFile.type = "video";
                          }
                          templist.push(tempFile);

                        }
                      }
                      formState.fileList = templist;
                    }
                    // console.log("form:", formState);
                  }
                });
              }
            });
          }
        });
      }

      // console.log("current:", currentMenuList);
      // 绑定长按事件
      setTimeout(() => {
        addTouchEvent();
      });

      // 获取一级、二级菜单数据
      selectList.value = [];
      menuList.value.forEach(item => {
        let tempItem = {
          value: item.id,
          label: item.title,
          children: []
        };
        if (item.childMenuList != null && item.childMenuList.length > 0) {
          tempItem.children = [];
          item.childMenuList.forEach(item2 => {
            let tempChild = {
              value: item2.id,
              label: item2.title
            };
            tempItem.children.push(tempChild);
          });
        }
        selectList.value.push(tempItem);
      });
    }

    // 表单--start

    interface FormState {
      title: string;
      level: Array<any>;
      spec: string;
      amt: string;
      unit: string;
      ps: string;
      fileList: Array<any>;
    }

    const formState = reactive<FormState>({
      title: "",
      level: [],
      spec: "",
      amt: "",
      unit: "",
      ps: "",
      fileList: []
    });

    const onFinish = (values: any) => {
      // console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
      // console.log("Failed:", errorInfo);
    };

    const clickSubmit = async () => {
      // console.log("submit::");
      // console.log(formState);
      // console.log(currentMenuList);
      if (formState.title != null && formState.title != "") {
        // 有名称
        if (formState.level != null && formState.level.length > 0) {
          // 有类别
          let temptype = "";
          let tempparams = new FormData();
          let tabletype = "";
          tempparams.append("name", formState.title);
          tempparams.append("spec", formState.spec);
          tempparams.append("unit", formState.unit);
          tempparams.append("amt", formState.amt);
          tempparams.append("ps", formState.ps);

          if (type.value == "basics" || type.value == "stringing") {
            tabletype = type.value;
            if (formState.fileList != null && formState.fileList.length > 0) {
              tempparams.append("other", formState.fileList[0].preview);
            }
            if (titleType.value == 1) {
              // 修改 1
              tempparams.append("id", currentMenuList.value["id"]);

              temptype = "set";
            } else if (titleType.value == 2) {
              // 新增 2
              tempparams.append("id", uuidV4());
              temptype = "insert";
            }
          } else if (type.value == "towerstep") {
            tabletype = "towers";
            tempparams.append("other1", formState.level[1]);
            if (formState.fileList != null && formState.fileList.length > 0) {
              tempparams.append("other2", formState.fileList[0].preview);
            }
            if (titleType.value == 1) {
              // 修改 1
              tempparams.append("id", currentMenuList.value["id"]);

              temptype = "set";
            } else if (titleType.value == 2) {
              // 新增 2
              tempparams.append("id", uuidV4());
              temptype = "insert";
            }
          }

          // 新增\修改对应数据
          await getToolData(tabletype, temptype, tempparams).then(res => {
            if (res.code == 200) {
              // console.log("提交数据-成功:", res);
              message.success("提交成功！");
              // // console.log("success-back");
              clickBack();
            } else {
              // console.log("提交数据-失败:", res);
              message.error("提交失败！");
            }
          }).catch((e) => {
            // console.log("提交数据-失败:", e);
            message.error("提交失败！");
          });


        } else {
          message.error("类别不能为空！")
        }
      } else {
        message.error("名称不能为空！")
      }

    };
    // 表单--end

    // 上传--start
    const fileType = ref();
    function getBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const previewVisible = ref(false);
    const previewImage = ref("");
    const previewTitle = ref("");

    const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = "";
      let video = document.getElementById("modalVideoId") as HTMLVideoElement
      if (video.paused) {
      } else {
        video.pause();
      }
    };

    const handlePreview = async (file: UploadProps["fileList"][number]) => {
      // console.log("handlePreview", file);
      formState.fileList.forEach(item => {
        item.showDeleteFlag = false;
      });
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      fileType.value = null;
      if (file.type.indexOf("image") != -1) {
        fileType.value = "image";
      } else if (file.type.indexOf("video") != -1) {
        fileType.value = "video";
        let video = document.getElementById("modalVideoId") as HTMLVideoElement
        if (video.paused) {
          video.play();
        }
      }
    };

    const deleteFile = async (file: UploadProps["fileList"][number]) => {
      await deleteImg(file.preview)
        .then(res => {
          if (res.code == 200) {
            // console.log("删除文件-成功:", res);
            return true;
          } else {
            // console.log("删除文件-失败:", res);
            return false;
          }
        })
        .catch(err => {
          // console.log("删除文件-失败:", err);
          return false;
        });
    };
    // 上传视频的方法
    const handleVideoChange = ({ file }) => {
      if (file.status !== "uploading" && file !== "") {
        formState.fileList.forEach(item => {
          if (item.uid == file.uid) {
            item.showDeleteFlag = false;
            setTimeout(() => {
              addTouchEvent();
            });
            item.preview = file.response.data;
          }
        });
      }
      // console.log("form:", formState);
    };

    // 长按显示删除--start
    const touchStartTime = ref();
    const addTouchEvent = () => {
      if (formState.fileList != null && formState.fileList.length > 0) {
        let domMoveFlag: boolean = true;
        formState.fileList.forEach((it: any, index: any) => {
          let item = document.getElementById(it.uid);
          item.ontouchstart = null;
          item.ontouchmove = null;
          item.ontouchend = null;

          item.ontouchstart = (startEvent: any) => {
            startEvent.preventDefault();
            // console.log(startEvent);
            touchStartTime.value = new Date();
            setTimeout(() => {
              if (domMoveFlag) {
                // console.log("执行元素位置操作过程");

                formState.fileList.forEach(i => {
                  i.showDeleteFlag = true;
                });
              }
            }, 600);
          };
          item.ontouchend = (endEvent: any) => {
            let time: any = new Date();
            // console.log(time - touchStartTime.value);
            if (time - touchStartTime.value <= 400) {
              domMoveFlag = false;
              item.click();
              formState.fileList.forEach(i => {
                i.showDeleteFlag = false;
              });
              setTimeout(() => {
                addTouchEvent();
              });
            } else {
              formState.fileList.forEach(i => {
                i.showDeleteFlag = true;
              });
            }
          };
        });
      }
    };

    // 是否打开文件对话框
    const openFlag = ref(true);
    // 点击上传按钮，去除删除键
    const clickAdd = () => {
      formState.fileList.forEach(i => {
        i.showDeleteFlag = false;
      });
      if (formState.fileList != null && formState.fileList.length > 0) {
        // 已有图片
        openFlag.value = false;
        message.error("只能上传一张图片！")
      } else {
        openFlag.value = true;
      }
    };
    // 上传图片删除--end

    // 上传--end

    // 级联选择标签显示
    const showLabel = ({ labels, selectedOptions }) => {
      return labels[labels.length - 1];
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
      clickAdd,
      previewVisible,
      previewImage,
      previewTitle,
      fileType,
      deleteFile,
      baseUrl,
      clickSubmit,
      handleCancel,
      handlePreview,
      selectList,
      showLabel,
      handleVideoChange,
      titleType,
      openFlag
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

  :deep(.ant-form .ant-form-item) {
    margin-bottom: 10px;
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
</style>