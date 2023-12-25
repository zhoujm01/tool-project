<template>
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

        <a-form-item label="描述" name="content">
          <a-textarea v-model:value="formState.content" placeholder="请输入描述" :auto-size="{ minRows: 1, maxRows: 10 }" />
        </a-form-item>

        <a-form-item name="上传" :wrapper-col="{ offset: 0, span: 24 }" style="height:100px">
          <div class="clearfix" style="margin-bottom:60px">
            <a-upload v-model:file-list="formState.fileList" :action="baseUrl" @preview="handlePreview"
              @remove="deleteFile" accept=".png, .jpg, .jpeg, .mp4, .svg" @change="handleVideoChange" :multiple="true">
              <div class="uploadButtonArea" @click="clickAdd">
                <img src="/picture/mobile/icon_添加.png" style="width: 20px;" />
                <div style="color:rgb(0, 190, 201);margin-top:5px">添加图片/视频</div>
              </div>
              <template #itemRender="{ file, actions }" class="uploadListArea">
                <a-space class="uploadItemArea">
                  <img class="uploadItemImgArea" :src="file.preview" v-if="file.type.indexOf('image') != -1"
                    @click="actions.preview" :id="file.uid" />
                  <div class="uploadItemImgArea" v-if="file.type.indexOf('video') != -1" :id="file.uid"
                    @click="actions.preview">
                    <video alt="example" style="width: 100%;height:100%;" :src="file.preview" :autoplay="false"></video>
                    <PlayCircleFilled
                      style="fontSize:35px;color:rgb(0, 190, 201);position: absolute;background: white;border-radius: 25px;" />
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

import leftIcon from "../assets/svgs/左箭头.svg";
import rightIcon from "../assets/svgs/右箭头.svg";

import { PlayCircleFilled } from "@ant-design/icons-vue";
import type { UploadProps } from 'ant-design-vue';
import { app } from "../main";

import { message } from "ant-design-vue";


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
            key: activeKey.value,
            type: type.value,
            sub: sub.value
          }
        });
      }
    };

    async function getparams() {
      await getReportData(null).then(res => {
        // console.log("res==", res);
        menuList.value = res.diagnosis;
        // 获取当前显示数据
        currentMenuList.value = [];
        keyList.value = [];
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
                      formState.level = [item1.key, item2.key];
                      formState.content = item3.contenttext;
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
            value: item.key,
            label: item.title,
            children: []
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
    }

    const formState = reactive<FormState>({
      title: "",
      level: [],
      content: "",
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
          // 修改3级数据
          let tempThree = {
            title: formState.title,
            bgimg: null, // 第一个上传的图片/视频
            contenttext: formState.content,
            moreflag: false,
            second: formState.level[1]
          };
          if (formState.fileList != null && formState.fileList.length > 0) {
            tempThree.bgimg = formState.fileList[0].preview;
          }
          let formData = new FormData();
          formData.append("title", tempThree.title);
          formData.append("bgimg", tempThree.bgimg);
          formData.append("contenttext", tempThree.contenttext);
          formData.append("moreflag", tempThree.moreflag.toString());
          formData.append("second", tempThree.second);

          let resultFlag = -1;
          if (titleType.value == 1) {
            // 编辑数据
            await changeReportData(currentMenuList.value["key"], "set", formData)
              .then(async res => {
                if (res.code == 200) {
                  // console.log("修改三级数据-成功:", res);
                  // 三级修改成功

                  // 删除所有4级媒体数据
                  if (
                    currentMenuList.value["medialist"] != null &&
                    currentMenuList.value["medialist"].length > 0
                  ) {
                    let len1 = 0;
                    await currentMenuList.value["medialist"].forEach(async item => {
                      let oldFour = new FormData();
                      oldFour.append("imgurl", item.imgurl);
                      oldFour.append("type", item.type);
                      oldFour.append("videourl", item.videourl);
                      oldFour.append("three", item.three);
                      await changeReportData(item.index, "delete", oldFour)
                        .then(async res2 => {
                          if (res2.code == 200) {
                            len1++;
                            // console.log("删除四级数据-成功:", res2);
                            if (len1 == currentMenuList.value["medialist"].length) {
                              // 删除4级成功
                              // 添加新的4级数据
                              if (formState.fileList != null && formState.fileList.length > 0) {
                                let len2 = 0;
                                formState.fileList.forEach(async (item3, index3) => {
                                  let newFour = new FormData();
                                  let parentKey1 = currentMenuList.value["key"];
                                  let cIndex = index3 + 1;
                                  let itemIndex = parentKey1 + "-" + cIndex;
                                  newFour.append("three", parentKey1);
                                  if (item3.type.indexOf("image") != -1) {
                                    newFour.append("imgurl", item3.preview);
                                    newFour.append("type", "img");
                                    newFour.append("videourl", null);
                                  } else if (item3.type.indexOf("video") != -1) {
                                    newFour.append("imgurl", null);
                                    newFour.append("type", "video");
                                    newFour.append("videourl", item3.preview);
                                  }
                                  await changeReportData(itemIndex, "insert", newFour)
                                    .then(res2 => {
                                      // // console.log("新增四级数据-成功:", res2);
                                      if (res2.code == 200) {
                                        len2++;
                                        // console.log("新增四级数据-成功:", res2);
                                        if (len2 == formState.fileList.length) {
                                          // 新增4级成功
                                          message.success("修改成功！");
                                          // console.log("success-back");
                                          clickBack();
                                        }
                                      } else {
                                        resultFlag++;
                                        // console.log("新增四级数据-失败:", res2);
                                        message.error("修改失败！");
                                      }
                                    })
                                    .catch(err2 => {
                                      resultFlag++;
                                      // console.log("新增四级数据-失败:", err2);
                                      message.error("修改失败！");
                                    });

                                });

                              } else {
                                // 没有新的4级
                                message.success("修改成功！");
                                // console.log("success-back");
                                clickBack();
                              }
                            }
                          } else {
                            resultFlag++;
                            // console.log("删除四级数据-失败:", res2);
                            message.error("修改失败！");
                          }
                        })
                        .catch(err2 => {
                          resultFlag++;
                          // console.log("删除四级数据-失败:", err2);
                          message.error("修改失败！");
                        });
                    });
                  } else {
                    // 没有旧的要删除
                    // 添加新的4级数据
                    if (formState.fileList != null && formState.fileList.length > 0) {
                      let len2 = 0;
                      await formState.fileList.forEach(async (item3, index3) => {
                        let newFour = new FormData();
                        let parentKey1 = currentMenuList.value["key"];
                        let cIndex = index3 + 1;
                        let itemIndex = parentKey1 + "-" + cIndex;
                        newFour.append("three", parentKey1);
                        if (item3.type.indexOf("image") != -1) {
                          newFour.append("imgurl", item3.preview);
                          newFour.append("type", "img");
                          newFour.append("videourl", null);
                        } else if (item3.type.indexOf("video") != -1) {
                          newFour.append("imgurl", null);
                          newFour.append("type", "video");
                          newFour.append("videourl", item3.preview);
                        }
                        await changeReportData(itemIndex, "insert", newFour)
                          .then(res2 => {
                            // // console.log("新增四级数据-成功:", res2);
                            if (res2.code == 200) {
                              len2++;
                              // console.log("新增四级数据-成功:", res2);
                              if (len2 == formState.fileList.length) {
                                // 新增四级完成
                                message.success("修改成功！");
                                // console.log("success-back");
                                clickBack();
                              }
                            } else {
                              resultFlag++;
                              // console.log("新增四级数据-失败:", res2);
                              message.error("修改失败！");
                            }
                          })
                          .catch(err2 => {
                            resultFlag++;
                            // console.log("新增四级数据-失败:", err2);
                            message.error("修改失败！");
                          });
                      });
                    }
                  }
                } else {
                  resultFlag++;
                  // console.log("修改三级数据-失败:", res);
                  message.error("修改失败！");
                }
              })
              .catch(err => {
                resultFlag++;
                // console.log("修改三级数据-失败", err);
                message.error("修改失败！");
              });
          } else if (titleType.value == 2) {
            // 新增数据

            let parentKey2 = formState.level[1];
            let tempKey = null;
            // 用查表中key值的接口生成最新的接口！
            let temp = new FormData();
            await changeData("three", "select", temp).then(async res1 => {
              // console.log("select:res", res1);
              if (res1.success == 0) {
                let maxKey = 0;
                if (res1.data != null && res1.data.length > 0) {
                  res1.data.forEach(item1 => {
                    let tempKey = item1.key.split("-");
                    let tempsub = tempKey[0] + "-" + tempKey[1];
                    if (tempsub == formState.level[1]) {
                      let currentKey = parseInt(tempKey[2]);
                      if (currentKey > maxKey) {
                        maxKey = currentKey;
                      }
                    }
                  });
                }
                let newKey = maxKey + 1;
                tempKey = parentKey2 + "-" + newKey;
                // 新增三级
                // 新增四级
                await changeReportData(tempKey, "insert", formData)
                  .then(async res => {
                    if (res.code == 200) {
                      // console.log("新增三级数据-成功:", res);


                      // 添加新的4级数据
                      if (
                        formState.fileList != null &&
                        formState.fileList.length > 0
                      ) {
                        let len3 = 0;
                        formState.fileList.forEach(async (item3, index3) => {
                          let newFour = new FormData();
                          let parentKey1 = tempKey;
                          let cIndex = index3 + 1;
                          let itemIndex = parentKey1 + "-" + cIndex;
                          newFour.append("three", parentKey1);
                          if (item3.type.indexOf("image") != -1) {
                            newFour.append("imgurl", item3.preview);
                            newFour.append("type", "img");
                            newFour.append("videourl", null);
                          } else if (item3.type.indexOf("video") != -1) {
                            newFour.append("imgurl", null);
                            newFour.append("type", "video");
                            newFour.append("videourl", item3.preview);
                          }
                          await changeReportData(itemIndex, "insert", newFour)
                            .then(res2 => {
                              // // console.log("新增四级数据-成功:", res2);
                              if (res2.code == 200) {
                                len3++;
                                // console.log("新增四级数据-成功:", res2);
                                if (len3 == formState.fileList.length) {
                                  // 提交数据正常
                                  message.success("新增成功！");
                                  // console.log("success-back");
                                  clickBack();
                                }
                              } else {
                                resultFlag++;
                                // console.log("新增四级数据-失败:", res2);
                                message.error("新增失败！");
                              }
                            })
                            .catch(err2 => {
                              resultFlag++;
                              // console.log("新增四级数据-失败:", err2);
                              message.error("新增失败！");
                            });
                        });
                      } else {
                        // 无四级数据
                        // 提交数据正常
                        message.success("新增成功！");
                        // console.log("success-back");
                        clickBack();
                      }
                    } else {
                      resultFlag++;
                      // console.log("新增三级数据-失败:", res);
                      message.error("新增失败！");
                    }
                  })
                  .catch(err => {
                    resultFlag++;
                    // console.log("新增三级数据-失败", err);
                    message.error("新增失败！");
                  });
              }
            });
          }
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

    // 点击上传按钮，去除删除键
    const clickAdd = () => {
      formState.fileList.forEach(i => {
        i.showDeleteFlag = false;
      });
    };
    // 上传图片删除--end

    // 上传--end

    // 级联选择标签显示
    const showLabel = ({ labels, selectedOptions }) => {
      return labels[labels.length - 1];
    };

    onMounted(async () => {
      await getparams();
      // addTouchEvent();
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
      titleType
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

  :deep(.ant-form .ant-form-item){
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
</style>