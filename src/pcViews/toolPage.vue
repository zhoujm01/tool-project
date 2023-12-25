<template>
  <div style="width: 100vw;height:100vh" id="mainPage">
    <a-layout class="mainPage">
      <!-- 左侧目录栏 -->
      <a-layout-sider class="leftArea">
        <!-- logo及标题 -->
        <div @click="() => { router.push({ path: '/' }) }">
          <img class="titleLogo" src="/picture/mobile/logo_诊断.png" />
          <div class="titleFont">{{ titleText }}</div>
        </div>
        <!-- 搜索框 -->
        <div>
          <a-input class="searchInput" v-model:value="searchValue" placeholder="输入关键词" :bordered="false"
            @pressEnter="onSearch">
            <template #prefix>
              <img class="searchLogo" src="../assets/svgs/icon_搜索.svg" />
            </template>
          </a-input>
        </div>
        <a-menu v-model:selectedKeys="state.selectedKeys" mode="inline" class="menuArea">
          <template v-for="item in menuList" :key="item.key">
            <a-menu-item class="menuItem" @click="clickMenu(item)">
              <img :src="item.icon" class="menuIcon" :style="selectMenuColor(item)" />
              <div class="menuFont">{{ item.title }}</div>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout id="rightContentArea">
        <a-layout-content class="rightContentArea">
          <a-tabs v-if="!state.contentFlag" v-model:activeKey="state.subSelectedKey" class="contentTab"
            @change="tabTitleClick(1)">
            <template v-for="item in state.currentPageList" :key="item.key">
              <a-tab-pane :tab="item.title" class="contentArea">
                <div class="contentCardArea" v-if="!searchFlag && item.childContentList.length > 0">
                  <template v-for="(item2, index) in item.childContentList">
                    <div class="contentItemArea" @click="clickContentCard(item2)">
                      <div class="contentItemBackground" v-if="item2 ? item2.bgType ? true : false : false">
                        <!-- 图片 -->
                        <div style="width: 100%;height:100%;" v-if="item2.bgType == 1">
                          <img :src="item2.bgimg" style="width: 100%;height:100%;border-radius: 10px 0px 0px 10px;" />
                          <div class="contentItemTitle">{{ item2.title }}</div>
                        </div>
                        <!-- 视频 -->
                        <div style="width: 100%;height:100%;" v-if="item2.bgType == 2">
                          <video style="width: 100%;height:100%;border-radius: 10px 0px 0px 10px;" :src="item2.bgimg"
                            :autoplay="false"></video>
                          <PlayCircleFilled style="font-size: 70px;color: rgb(80, 146, 244);position: absolute;background: white;
                          border-radius: 25px;left: calc(12.5% - 35px);top: calc(50% - 35px);" />
                          <div class="contentItemTitle">{{ item2.title }}</div>
                        </div>
                      </div>
                      <!-- 空白图片 -->
                      <div class="contentItemBackground" v-if="item2 ? item2.bgType ? false : true : true">
                        <div class="contentItemTitle">{{ item2.title }}</div>
                      </div>

                      <div class="contentItemTextArea" :id="'contentItemTextAreaId' + index"
                        v-if="item2 ? item2.contenttext ? true : false : false">
                        <div class="contentItemText" :id="'contentItemTextId' + index">
                          <div v-if="item2.spec != null && item2.spec != ''">
                            规格：{{ item2.spec }}</div>
                          <div v-if="item2.amt != null && item2.amt != ''">
                            数量：{{ item2.amt }}</div>
                          <div v-if="item2.unit != null && item2.unit != ''">
                            单位：{{ item2.unit }}</div>

                        </div>


                      </div>
                      <div class="contentItemTextArea" style="display:flex;">
                        <a-divider type="vertical" style="height:100%;margin-right: 15px;" />
                        <div v-if="item2.ps != null && item2.ps != ''" class="contentItemText">
                          说明：{{ item2.ps }}</div>
                      </div>
                     
                    </div>
                  </template>

                </div>
                <div class="searchCardArea" v-else>
                  <template v-for="(item2, index) in item.childContentList">
                    <div class="searchItemArea" @click="searchCardClick(item2)">
                      <span v-html="item2.title" class="searchTitle"></span>
                      <div>
                        <span v-html="item2.contenttext" class="searchContent"></span>
                      </div>
                    </div>
                  </template>
                </div>
                <div v-if="state.currentDataList[state.subSelectedIndex].childContentList?.length > 0">
                  <a-pagination v-model:current="currentPage"
                    :total="state.currentDataList[state.subSelectedIndex].childContentList?.length" @change="changePage"
                    :pageSize="pageSize" class="pageArea" :showSizeChanger="false" />
                </div>
              </a-tab-pane>
            </template>
            <template #renderTabBar="{ DefaultTabBar, ...props }">
              <div class="tabTitleArea" :style="{ width: searchFlag ? '100%' : 'calc(100% - 100px)' }">
                <img :src="leftIcon" class="tabButton" @click="clickTabButton(1)" />
                <component :is="DefaultTabBar" v-bind="props" class="tabTitle" />
                <img :src="rightIcon" class="tabButton" @click="clickTabButton(2)" />
                <a-button type="primary" class="addButton" v-if="!searchFlag"
                  @click="() => { state.drawerShow = true; state.drawerAdd = true; }">
                  <template #icon>
                    <div class="addContent">
                      <img :src="addIcon" class="addImg" />
                      <div>添加</div>
                    </div>
                  </template>
                </a-button>
              </div>
            </template>
          </a-tabs>
          <div v-if="state.contentFlag" style="height: 100%;width:100%;">
            <!-- 标题 -->
            <div style="display: flex;justify-content: space-between;align-items:center;">
              <div style="display: flex;align-items:center;">
                <img :src="leftIcon" style=" width: 10px;margin: 20px;" @click="clickContentBack" />
                <div style="font-weight: 600;font-size: 20px;">{{ state.currentContentData.title }}</div>
              </div>
              <a-button type="primary" class="editButton"
                @click="() => { state.drawerShow = true; state.drawerAdd = false; getForm(); }">
                <template #icon>
                  <div class="editContent">
                    <img :src="editIcon" class="editImg" />
                    <div>编辑</div>
                  </div>
                </template>
              </a-button>
            </div>
            <!-- 内容 -->
            <div style="display: flex;height: calc(100% - 65px);">
              <!-- 图片、视频 -->
              <div class="imgArea">
                <template v-for="(item) in state.currentContentData.medialist">
                  <div class="imgItem" v-if="item.type == 'img'">
                    <a-image class="imgItem1" :src="item.imgurl" :previewMask="false" height="100%"
                      width="100%"></a-image>
                  </div>
                  <video :src="item.videourl" :id="'video' + item.index" v-if="item.type == 'video'" class="imgItem"
                    controls></video>
                </template>
              </div>
              <!-- 文字 -->
              <div class="textArea">
                <a-typography class="contentItemText">
                  <template v-if="state.currentContentData.contenttext.indexOf('\n') != -1">
                    <template v-for="item3 in state.currentContentData.contenttext.split('\n')">
                      <a-typography-paragraph class="contentFont">{{ item3 }}</a-typography-paragraph>
                    </template>
                  </template>
                  <template v-else>
                    <a-typography-paragraph class="contentFont">{{ state.currentContentData.contenttext
                    }}</a-typography-paragraph>
                  </template>
                </a-typography>
              </div>
            </div>
          </div>
          <a-drawer v-model:open="state.drawerShow" class="custom-class" :title="state.drawerAdd ? '新增' : '详情编辑'"
            placement="right" size="large" :closable="false" @close="() => { state.drawerShow = false; clearForm(); }">
            <template #extra>
              <CloseOutlined @click="() => { state.drawerShow = false; clearForm(); }" />
            </template>
            <!-- 内容编辑表单 -->
            <a-form :model="formState" v-if="state.drawerAdd == false" name="basic" :layout="'vertical'"
              autocomplete="off" style="width: 100%;">
              <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请输入名称！' }]">
                <a-input v-model:value="formState.title" placeholder="请输入名称" />
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


              <a-form-item label="图片或视频" name="medialist">
                <div class="clearfix" style="margin-bottom:60px">
                  <a-upload v-model:file-list="formState.fileList" :action="baseUrl" @preview="handlePreview"
                    @remove="deleteFile" accept=".png, .jpg, .jpeg, .mp4, .svg" @change="handleVideoChange"
                    :multiple="false" :max-count="1" :openFileDialogOnClick="openFlag">
                    <div @click="clickAdd">
                      <a-button type="primary" class="uploadButton">
                        <template #icon>
                          <div class="uploadContent">
                            <UploadOutlined :style="{ fontSize: '18px', 'margin-right': '5px' }" />
                            <div>上传</div>
                          </div>
                        </template>
                      </a-button>

                    </div>
                    <template #itemRender="{ file, actions }">
                      <a-space class="uploadItemArea">
                        <div class="uploadItemImgArea" v-if="file.type.indexOf('image') != -1" @click="actions.preview"
                          :id="file.uid">
                          <a-image :src="file.preview" :previewMask="false" height="100%" style="border-radius: 10px;"
                            width="100%"></a-image>
                        </div>
                        <div class="uploadItemImgArea" v-if="file.type.indexOf('video') != -1" :id="file.uid"
                          @click="actions.preview">
                          <video alt="example" style="width: 100%;height:100%;" :src="file.preview" :autoplay="false"
                            :id="'modalVideoId' + file.uid"></video>
                          <PlayCircleFilled
                            style="fontSize:35px;color:rgb(80, 146, 244);position: absolute;background: white;border-radius: 25px;" />
                        </div>

                        <div @click="actions.remove" style="position: absolute;width: 100%;height: 30px;
                      background: rgba(248, 98, 98, 0.5);bottom: 4px;left: 0px;display: flex;align-items: center;
                      justify-content: center;color: rgb(255, 255, 255);border-radius: 0px 0px 10px 10px;">
                          <delete-outlined style="margin-right:5px;font-size: 14px;" />
                          <div>删除</div>
                        </div>
                      </a-space>
                    </template>
                  </a-upload>
                </div>
              </a-form-item>
            </a-form>
            <!-- 新增类别表单 -->
            <a-form :model="formState" v-if="state.drawerAdd == true" name="basic" :layout="'vertical'" autocomplete="off"
              style="width: 100%;">
              <a-divider orientation="left" class="modalDivider">主类别</a-divider>
              <a-form-item label="名称" name="mainName" :rules="[{ required: true, message: '请输入类别！' }]">
                <a-select v-model:value="formState.mainName" style="width: 100%;text-align:left;" placeholder="请输入类别"
                  :options="selectList" allowClear notFoundContent :showArrow="false" @select="selectOneMenu"></a-select>
              </a-form-item>

              <a-divider orientation="left" class="modalDivider">子类别</a-divider>
              <a-form-item label="名称" name="subName" :rules="[{ required: true, message: '请输入子类别！' }]">
                <a-select v-model:value="formState.subName" style="width: 100%;text-align:left;" placeholder="请输入子类别"
                  :options="oldTwoMenuList" :filter-option="filterTwoOption" show-search allowClear notFoundContent
                  :showArrow="false" @select="selectTwoMenu" :disabled="subDisableFlag"></a-select>

              </a-form-item>
              <a-divider orientation="left" class="modalDivider">内容</a-divider>
              <a-form-item label="名称" name="title" :rules="[{ required: true, message: '请输入名称！' }]">
                <a-input v-model:value="formState.title" placeholder="请输入名称" />
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


              <a-form-item label="图片或视频" name="medialist">
                <div class="clearfix" style="margin-bottom:60px">
                  <a-upload v-model:file-list="formState.fileList" :action="baseUrl" @preview="handlePreview"
                    @remove="deleteFile" accept=".png, .jpg, .jpeg, .mp4, .svg" @change="handleVideoChange"
                    :multiple="false" :max-count="1" :openFileDialogOnClick="openFlag">
                    <div @click="clickAdd">
                      <a-button type="primary" class="uploadButton">
                        <template #icon>
                          <div class="uploadContent">
                            <UploadOutlined :style="{ fontSize: '18px', 'margin-right': '5px' }" />
                            <div>上传</div>
                          </div>
                        </template>
                      </a-button>

                    </div>
                    <template #itemRender="{ file, actions }">
                      <a-space class="uploadItemArea">
                        <div class="uploadItemImgArea" v-if="file.type.indexOf('image') != -1" @click="actions.preview"
                          :id="file.uid">
                          <a-image :src="file.preview" :previewMask="false" height="100%" style="border-radius: 10px;"
                            width="100%"></a-image>
                        </div>
                        <div class="uploadItemImgArea" v-if="file.type.indexOf('video') != -1" :id="file.uid"
                          @click="actions.preview">
                          <video alt="example" style="width: 100%;height:100%;" :src="file.preview" :autoplay="false"
                            :id="'modalVideoId' + file.uid"></video>
                          <PlayCircleFilled
                            style="fontSize:35px;color:rgb(80, 146, 244);position: absolute;background: white;border-radius: 25px;" />
                        </div>

                        <div @click="actions.remove" style="position: absolute;width: 100%;height: 30px;
                      background: rgba(248, 98, 98, 0.5);bottom: 4px;left: 0px;display: flex;align-items: center;
                      justify-content: center;color: rgb(255, 255, 255);border-radius: 0px 0px 10px 10px;">
                          <delete-outlined style="margin-right:5px;font-size: 14px;" />
                          <div>删除</div>
                        </div>
                      </a-space>
                    </template>
                  </a-upload>
                </div>
              </a-form-item>
            </a-form>

            <!-- 底部提交按钮 -->
            <div style="width: calc(100% - 48px);position: absolute;bottom: 0px;display: flex;flex-direction: column;
          align-items: end;background:#fff;padding-bottom:20px">
              <a-divider style="margin-top:0px" />
              <div>
                <a-button type="primary" class="submitButton" @click="clickSubmit()"
                  style="margin-right:10px;">提交</a-button>
                <a-button type="primary" class="submitButton" style="background: #FF5F67;" v-if="state.drawerAdd == false"
                  @click="clickDelete()">删除</a-button>
              </div>

            </div>
          </a-drawer>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts">
import icon1 from "../assets/svgs/icon_通用工器具.svg";
import icon2 from "../assets/svgs/icon_施工流程.svg";
import icon3 from "../assets/svgs/icon_自由主题.svg";
import icon4 from "../assets/svgs/icon_附件.svg";
import icon5 from "../assets/svgs/icon_牵张场地选择.svg";

import mobileIcon1 from "/picture/mobile/icon_预控及诊断处理系统.png";
import mobileIcon2 from "/picture/mobile/icon_施工流程.png";
import mobileIcon3 from "/picture/mobile/icon_自由主题.png";
import mobileIcon4 from "/picture/mobile/icon_附件安装.png";
import mobileIcon5 from "/picture/mobile/icon_牵张场地选择.png";

import addIcon from "../assets/svgs/添加.svg";
import editIcon from "../assets/svgs/编辑.svg";

import leftIcon from "../assets/svgs/左箭头.svg";
import rightIcon from "../assets/svgs/右箭头.svg";

import { ref, reactive, watch, h, onMounted, onUnmounted, nextTick } from "vue";

import CssFilterConverter from "css-filter-converter";
import router from "../router";
import { useRouter } from "vue-router";

import {
  getReportData,
  deleteImg,
  changeReportData,
  changeData
} from "../api/data";
import { getToolData } from "../api/tooldata";
import { v4 as uuidV4 } from "uuid"
import { CloseOutlined, UploadOutlined, PlayCircleFilled, DeleteOutlined } from '@ant-design/icons-vue';
import { app } from "../main";

import { message } from "ant-design-vue";
import type { UploadProps } from 'ant-design-vue';

export default {
  components: {
    CloseOutlined,
    UploadOutlined,
    PlayCircleFilled,
    DeleteOutlined
  },
  setup() {
    const router = useRouter();
    const appSettings = app.config.globalProperties.$appSettings;
    const baseUrl = ref(appSettings.restUrl + "uploadimg");
    // 消息配置
    message.config({
      top: `80px`,
      getContainer: () => document.getElementById("mainPage")
    })

    const titleText = "架线施工工器具计算复核系统";

    const searchFlag = ref(false);
    // 分页：当前页数
    const currentPage = ref(1);
    const pageSize = ref(3);

    // 是否打开文件对话框
    const openFlag = ref(true);
    // 是否可选择子类别
    const subDisableFlag = ref(false);

    const menuList = ref();
    const state = ref({
      collapsed: false,
      selectedKeys: [],
      selectedIndex: 0,
      subSelectedKey: null,
      subSelectedIndex: 0,
      currentPageList: [], // 当前页显示数据
      currentDataList: [], // 当前条目下分页总数据
      contentFlag: false,// 是否显示内容区域
      currentContentData: { // 当前内容页显示的内容
        bgimg: "",
        contenttext: "",
        key: "",
        medialist: [],
        moreflag: false,
        second: "",
        title: "",
        first: "",
        spec: "",
        ps: "",
        unit: "",
        amt: "",
        type: "",
        id: null,
      },
      drawerShow: false,// 是否显示抽屉
      drawerAdd: false,// 是否新增
    });
    let searchValue = ref();

    // 已有菜单选择列表
    const selectList = ref();
    // 获取下拉数据
    const getSelectMenu = () => {
      // 获取一级、二级菜单数据
      selectList.value = [];
      menuList.value.forEach(item => {
        let tempItem = {
          value: item.id,
          label: item.title,
          icon: item.mobileIcon,
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

    // 表单
    interface FormState {
      title: string;
      level: Array<any>;
      content: string;
      fileList: Array<any>;
      mainName: string;
      mainIcon: string;
      subName: string;
      first: string;
      second: string;
      spec: string;
      ps: string;
      unit: string;
      amt: string;
      type: string;
    }

    const formState = reactive<FormState>({
      title: "",
      level: [],
      content: "",
      fileList: [],
      mainName: "",
      mainIcon: "mobileIcon1",
      subName: "",
      first: "",
      second: "",
      spec: "",
      ps: "",
      unit: "",
      amt: "",
      type: "",
    });

    // 新增类别list
    const oldTwoMenuList = ref();

    const getColor = (temp: any) => {
      return CssFilterConverter.hexToFilter(temp).color;
    };
    const selectMenuColor = (currentItem: any) => {
      if (state.value.selectedKeys[0] == currentItem.key) {
        let color = getColor("#5092F4");
        return `filter: ${color}`;
      } else {
        return "";
      }
    };
    const clickMenu = (tempItem: any) => {
      state.value.contentFlag = false;
      searchFlag.value = false;
      menuList.value.forEach((item, index) => {
        if (item.key == tempItem.key) {
          state.value.selectedIndex = index;
          state.value.subSelectedIndex = 0;
          state.value.subSelectedKey = item.childMenuList[0].key;
          setTimeout(() => {
            tabTitleClick(1);
          });
        }
      });
    };
    // 显示“查看详情”
    const showMoreButton = () => {
      let list =
        state.value.currentPageList[state.value.subSelectedIndex]
          .childContentList;
      if (list != null && list.length > 0) {
        list.forEach((item, index) => {
          let tempArea = document.getElementById(
            "contentItemTextAreaId" + index
          );
          let tempText = document.getElementById("contentItemTextId" + index);
          if (tempArea.clientHeight - 30 < tempText.clientHeight) {
            item.moreflag = true;
          } else {
            item.moreflag = false;
          }
        });
      }
    };

    // 点击卡片/点击查看详情按钮
    const clickContentCard = (tempItem: any) => {
      // // console.log("state", state)
      state.value.contentFlag = true;
      state.value.currentContentData.bgimg = tempItem.bgimg ? tempItem.bgimg : "";
      state.value.currentContentData.contenttext = tempItem.contenttext ? tempItem.contenttext : "";
      state.value.currentContentData.key = tempItem.key ? tempItem.key : "";
      state.value.currentContentData.medialist = tempItem.medialist ? tempItem.medialist : [];
      state.value.currentContentData.moreflag = tempItem.moreflag ? tempItem.moreflag : false;
      state.value.currentContentData.second = tempItem.second ? tempItem.second : "";
      state.value.currentContentData.title = tempItem.title ? tempItem.title : "";
      state.value.currentContentData.first = state.value.selectedKeys[0];

      state.value.currentContentData.spec = tempItem.spec ? tempItem.spec : "";
      state.value.currentContentData.ps = tempItem.ps ? tempItem.ps : "";
      state.value.currentContentData.unit = tempItem.unit ? tempItem.unit : "";
      state.value.currentContentData.amt = tempItem.amt ? tempItem.amt : "";

      state.value.currentContentData.type = tempItem.type ? tempItem.type : "";

      state.value.currentContentData.id = tempItem.id ? tempItem.id : "";

    };

    // 表单赋值
    const getForm = () => {
      formState.title = state.value.currentContentData.title;
      formState.content = state.value.currentContentData.contenttext;

      formState.spec = state.value.currentContentData.spec;
      formState.ps = state.value.currentContentData.ps;
      formState.unit = state.value.currentContentData.unit;
      formState.amt = state.value.currentContentData.amt;

      formState.type = state.value.currentContentData.type;

      formState.level = [state.value.currentContentData.first, state.value.currentContentData.second];
      // 获取媒体数据
      formState.fileList = [];
      let tempcontent = state.value.currentContentData;
      if (
        tempcontent.medialist != null &&
        tempcontent.medialist.length > 0
      ) {
        let templist = [];

        for (let i = 1; i <= tempcontent.medialist.length; i++) {
          let tempItem = tempcontent.medialist.filter((item5) => {
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
      // // console.log("form:", formState);
    }

    // 表单清空
    const clearForm = () => {
      // 二级类别下拉框情况
      oldTwoMenuList.value = [];
      // 表单数据清空
      formState.title = "";
      formState.content = "";
      formState.fileList = [];
      formState.level = [];

      formState.mainName = null;
      formState.mainIcon = "mobileIcon1";
      formState.subName = null;
      formState.first = null;
      formState.second = null;

      formState.spec = null;
      formState.ps = null;
      formState.unit = null;
      formState.amt = null;
      formState.type = null;

    }

    // 回车键搜索
    const onSearch = () => {
      state.value.contentFlag = false;
      state.value.selectedIndex = 0;
      state.value.subSelectedIndex = 0;

      currentPage.value = 1;

      if (searchValue.value != null && searchValue.value != "") {
        searchFlag.value = true;
        state.value.selectedKeys = [];
        state.value.subSelectedKey = "search";
        pageSize.value = 3;
        let list = [];
        let temp = {
          key: "search",
          label: "搜索结果",
          title: "搜索结果",
          childContentList: []
        };
        // 传入关键词，返回搜索结果
        let Reg = new RegExp(searchValue.value, "g");
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
              contenttext: content1
            };
            temp.childContentList.push(tempItem);
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
                first: item.key,
              };
              temp.childContentList.push(tempItem2);
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
                  first: item.key,
                  second: item2.key,
                };
                temp.childContentList.push(tempItem3);
              }
            });
          });
        });

        list.push(temp);
        state.value.currentDataList = list;
      } else {
        // 进入默认位置
        searchFlag.value = false;
        state.value.selectedKeys = [menuList.value[0].key];
        state.value.subSelectedKey = menuList.value[0].childMenuList[0].key;
        pageSize.value = 3;
        state.value.currentDataList = menuList.value[0].childMenuList;
      }
      getPageList();
    };

    // 点击搜索结果card，跳转到对应位置
    const searchCardClick = (tempItem: any) => {
      searchFlag.value = false;
      // 默认值
      state.value.selectedKeys = [menuList.value[0].key];
      state.value.subSelectedIndex = 0;
      state.value.subSelectedKey = menuList.value[0].childMenuList[0].key;
      state.value.selectedIndex = 0;
      pageSize.value = 3;
      currentPage.value = 1;

      // 点击跳转
      switch (tempItem.flag) {
        case "main":
          state.value.selectedKeys = [tempItem.key];
          state.value.selectedIndex = tempItem.index;
          state.value.subSelectedKey =
            menuList.value[tempItem.index].childMenuList[0].key;
          state.value.subSelectedIndex = 0;
          break;
        case "sub":
          let mainkey = tempItem.first;
          state.value.selectedKeys = [mainkey];
          menuList.value.forEach((item, index) => {
            if (item.key == mainkey) {
              state.value.selectedIndex = index;
            }
          });
          state.value.subSelectedKey =
            menuList.value[state.value.selectedIndex].childMenuList[
              tempItem.index
            ].key;
          state.value.subSelectedIndex = tempItem.index;
          break;
        case "card":
          let mainkey2 = tempItem.first;
          let subkey2 = tempItem.second;
          state.value.selectedKeys = [mainkey2];
          menuList.value.forEach((item, index) => {
            if (item.key == mainkey2) {
              state.value.selectedIndex = index;
              state.value.subSelectedKey = subkey2;
              item.childMenuList.forEach((item2, index2) => {
                if (item2.key == subkey2) {
                  state.value.subSelectedIndex = index2;
                }
              });
            }
          });
          break;
      }
      if (tempItem.flag == "card") {
        let temp4=tempItem.index / 3
        let pageNum = parseInt(temp4.toFixed(0)) + 1;
        currentPage.value = pageNum;
      }
      state.value.currentDataList =
        menuList.value[state.value.selectedIndex].childMenuList;

      getPageList();
    };

    const timer = ref();
    // 点击tab左右按钮
    const clickTabButton = (flag: any) => {
      if (flag == 1) {
        // 左
        // 保存滚动盒子左侧已滚动的距离
        let left = document.getElementsByClassName("ant-tabs-nav-list")[0]
          .scrollLeft;
        // 保存元素的可见宽度
        let clientWidth = document.getElementsByClassName(
          "ant-tabs-nav-list"
        )[0].clientWidth;
        let num = 0;
        clearInterval(timer.value);
        timer.value = null;
        timer.value = setInterval(() => {
          //   !left:已经滚动到最左侧
          //   一次性滚动距离（可调节）
          if (!left || num >= clientWidth) {
            // 停止滚动
            clearInterval(timer.value);
            timer.value = null;
            return;
          }
          // 给滚动盒子元素赋值向左滚动距离
          document.getElementsByClassName(
            "ant-tabs-nav-list"
          )[0].scrollLeft = left -= 10;
          // 保存向左滚动距离（方便判断一次性滚动多少距离）
          num += 10;
        }, 20);
        // 20：速度（可调节）
      } else if (flag == 2) {
        // 右
        // 保存滚动盒子左侧已滚动的距离
        let left = document.getElementsByClassName("ant-tabs-nav-list")[0]
          .scrollLeft;
        // 保存元素的整体宽度
        let scrollWidth = document.getElementsByClassName(
          "ant-tabs-nav-list"
        )[0].scrollWidth;
        // 保存元素的可见宽度
        let clientWidth = document.getElementsByClassName(
          "ant-tabs-nav-list"
        )[0].clientWidth;
        let num = 0;
        clearInterval(timer.value);
        timer.value = setInterval(() => {
          // 已经滚动距离+可见宽度
          // left+clientWidth>=scrollWidth：滚动到最右侧
          // num>=300一次性滚动距离
          if (left + clientWidth >= scrollWidth || num >= clientWidth) {
            clearInterval(timer.value);
            return;
          }
          // 给滚动盒子元素赋值向左滚动距离
          document.getElementsByClassName(
            "ant-tabs-nav-list"
          )[0].scrollLeft = left += 10;
          // 保存向左滚动距离（方便判断一次性滚动多少距离）
          num += 10;
        }, 20);
        // 20：速度（可调节）
      }
    };
    const tabTitleClick = (flag) => {


      if (flag != null) {
        currentPage.value = flag;
      }
      menuList.value[state.value.selectedIndex].childMenuList.forEach(
        (it, index) => {
          if (it.key == state.value.subSelectedKey) {
            state.value.subSelectedIndex = index;
            state.value.currentDataList =
              menuList.value[state.value.selectedIndex].childMenuList;

            getPageList();
            setTimeout(() => {
              document
                .getElementsByClassName("ant-tabs-tab")
              [state.value.subSelectedIndex].scrollIntoView();
            });
          }
        }
      );
    };
    const getPageList = () => {

      let indexFirst = pageSize.value * currentPage.value - pageSize.value;
      // console.log("page1", pageSize.value, currentPage.value, indexFirst)
      let list = [];
      state.value.currentDataList.forEach((it, index) => {
        let temp = {
          key: it.key,
          label: it.label,
          title: it.title,
          childContentList: []
        };
        if (it.childContentList != null && it.childContentList.length > 0) {
          temp.childContentList = [];

          if (it.key == state.value.subSelectedKey && indexFirst >= it.childContentList?.length) {
            // 页数超出总数，重新回到第一页
            currentPage.value = 1;
            indexFirst = 0;
          }
          if (indexFirst + pageSize.value <= it.childContentList?.length) {
            for (let i = 0; i < pageSize.value; i++) {
              temp.childContentList.push(it.childContentList[indexFirst + i]);
            }
          } else {

            // 总行数不足
            let num = it.childContentList?.length % pageSize.value;
            for (let i = 0; i < num; i++) {
              temp.childContentList.push(it.childContentList[indexFirst + i]);
            }

          }

        }
        list.push(temp);
      });
      // // console.log("currentDataList2", state.value.currentDataList, list);

      // // console.log("page", pageSize.value, currentPage.value, indexFirst)
      state.value.currentPageList = list;
    };
    // 点击切换页码
    const changePage = (page, pageSize) => {
      getPageList();
    };

    async function getparams() {
      // 工器具
      // 一级模块固定为表格，不能新增
      // 拼menulist
      menuList.value = [];
      let oldTypeList = [];
      // basics
      await getToolData("basics", "select", new FormData()).then(res => {
        // console.log("res==", res);
        oldTypeList = res.result;

        let tempList1 = {
          key: "1",
          type: "basics",
          label: "基础施工",
          title: "基础施工",
          childMenuList: [],
          icon: icon2,
          id: "basics",
        };
        let tempList2 = {
          label: "基础施工",
          title: "基础施工",
          key: "1-1",
          first: "1",
          type: "basics",
          childContentList: [],
          id: "basics",
        };

        oldTypeList.forEach((item, index) => {
          let tempkey = index + 1;
          // 只显示1张图片，不显示视频
          let spec2 = item.spec != null && item.spec != "" ? "规格：" + item.spec + "\n" : "";
          let ps2 = item.ps != null && item.ps != "" ? "说明：" + item.ps + "\n" : "";
          let unit2 = item.unit != null && item.unit != "" ? "单位：" + item.unit + "\n" : "";
          let amt2 = item.amt != null && item.amt != "" ? "数量：" + item.amt + "\n" : "数量：0\n";

          let temp3 = {
            bgType: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? 2 : 1 : 0,
            bgimg: item.other,
            contenttext: `${spec2}${amt2}${unit2}${ps2}`,
            key: tempList2.key + "-" + tempkey,
            type: "basics",
            medialist: [],
            moreflag: false,
            second: tempList2.id,
            title: item.name,
            spec: item.spec,
            ps: item.ps,
            unit: item.unit,
            amt: item.amt,
            id: item.id,
          };
          if (item.other != null && item.other != "") {
            let tempitem1 = {
              imgurl: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? "null" : item.other : "null",
              index: tempList2.key + "-" + tempkey + "-1",
              three: tempList2.key + "-" + tempkey,
              type: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? "video" : "img" : "",
              videourl: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? item.other : "null" : "null",
            }
            temp3.medialist.push(tempitem1);
          }
          tempList2.childContentList.push(temp3);
        });
        tempList1.childMenuList.push(tempList2);
        menuList.value.push(tempList1);
      });

      // towerstep
      await getToolData("towerstep", "select", new FormData()).then(res => {
        // console.log("res==", res);
        oldTypeList = res.result;
        // 有分级
        let tempList1 = {
          type: "towerstep",
          key: "2",
          label: "组塔施工",
          title: "组塔施工",
          childMenuList: [],
          icon: icon3,
          id: "towerstep",

        };

        oldTypeList.forEach((item, index) => {

          let tempkey = index + 1;
          let tempList2 = {
            type: "towerstep",
            label: item.name,
            title: item.name,
            key: "2-" + tempkey,
            first: "2",
            childContentList: [],
            id: item.id,
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
                type: "towerstep",
                bgType: item2.other2 != null && item2.other2 != "" ? item2.other2.indexOf(".mp4") != -1 ? 2 : 1 : 0,
                bgimg: item2.other2,
                contenttext: `${spec2}${amt2}${unit2}${ps2}`,
                key: "2-" + tempkey + "-" + tempkey2,
                medialist: [],
                moreflag: false,
                second: tempList2.id,
                title: item2.name,
                spec: item2.spec,
                ps: item2.ps,
                unit: item2.unit,
                amt: item2.amt,
                id: item2.id,
              };
              if (item2.other2 != null && item2.other2 != "") {
                let tempitem1 = {
                  imgurl: item2.other2 != null && item2.other2 != "" ? item2.other2.indexOf(".mp4") != -1 ? "null" : item2.other2 : "null",
                  index: "2-" + tempkey + "-" + tempkey2 + "-1",
                  three: "2-" + tempkey + "-" + tempkey2,
                  type: item2.other2 != null && item2.other2 != "" ? item2.other2.indexOf(".mp4") != -1 ? "video" : "img" : "",
                  videourl: item2.other2 != null && item2.other2 != "" ? item2.other2.indexOf(".mp4") != -1 ? item2.other2 : "null" : "null",
                }
                temp3.medialist.push(tempitem1);
              }
              tempList2.childContentList.push(temp3);
            })
          }
          tempList1.childMenuList.push(tempList2);
        });
        menuList.value.push(tempList1);

      });
      await getToolData("stringing", "select", new FormData()).then(res => {
        // console.log("res==", res);
        oldTypeList = res.result;

        let tempList1 = {
          key: "3",
          label: "架线工程",
          title: "架线工程",
          type: "stringing",
          childMenuList: [],
          icon: icon4,
          id: "stringing",
        };
        let tempList2 = {
          label: "架线工程",
          title: "架线工程",
          key: "3-1",
          first: "3",
          type: "stringing",
          childContentList: [],
          id: "stringing",
        };

        oldTypeList.forEach((item, index) => {
          let tempkey = index + 1;
          // 只显示1张图片，不显示视频
          let spec2 = item.spec != null && item.spec != "" ? "规格：" + item.spec + "\n" : "";
          let ps2 = item.ps != null && item.ps != "" ? "说明：" + item.ps + "\n" : "";
          let unit2 = item.unit != null && item.unit != "" ? "单位：" + item.unit + "\n" : "";
          let amt2 = item.amt != null && item.amt != "" ? "数量：" + item.amt + "\n" : "数量：0\n";

          let temp3 = {
            bgType: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? 2 : 1 : 0,
            bgimg: item.other,
            contenttext: `${spec2}${amt2}${unit2}${ps2}`,
            key: tempList2.key + "-" + tempkey,
            type: "stringing",
            medialist: [],
            moreflag: false,
            second: tempList2.id,
            title: item.name,
            spec: item.spec,
            ps: item.ps,
            unit: item.unit,
            amt: item.amt,
            id: item.id,
          };
          if (item.other != null && item.other != "") {
            let tempitem1 = {
              imgurl: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? "null" : item.other : "null",
              index: tempList2.key + "-" + tempkey + "-1",
              three: tempList2.key + "-" + tempkey,
              type: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? "video" : "img" : "",
              videourl: item.other != null && item.other != "" ? item.other.indexOf(".mp4") != -1 ? item.other : "null" : "null",
            }
            temp3.medialist.push(tempitem1);
          }
          tempList2.childContentList.push(temp3);
        });
        tempList1.childMenuList.push(tempList2);
        menuList.value.push(tempList1);


      });
      // console.log("menuList==", menuList.value);
      // 获取级联菜单list
      getSelectMenu();
    }

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
        let video = document.getElementById("modalVideoId" + file.uid)
        video.requestFullscreen();

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
      if (formState.fileList != null && formState.fileList.length > 0) {
        // 已有图片
        openFlag.value = false;
        message.error("只能上传一个文件！")
      } else {
        openFlag.value = true;
      }
    };
    // 上传图片删除--end

    // 上传--end

    // 新增三四级数据
    const addThreeAndFour = async (second, three) => {

      // 新增三四级
      // 新增3级数据
      let tempThree = {
        title: formState.title,
        bgimg: null, // 第一个上传的图片/视频
        contenttext: formState.content,
        moreflag: false,
        second: second,
        spec: formState.spec,
        ps: formState.ps,
        unit: formState.unit,
        amt: formState.amt,
      };
      if (formState.fileList != null && formState.fileList.length > 0) {
        tempThree.bgimg = formState.fileList[0].preview;
      }
      let formData = new FormData();
      formData.append("title", tempThree.title);
      formData.append("bgimg", tempThree.bgimg);
      formData.append("contenttext", tempThree.contenttext);
      formData.append("moreflag", tempThree.moreflag.toString());
      formData.append("second", second);

      // 新增数据
      await changeReportData(three, "insert", formData)
        .then(async res => {
          if (res.code == 200) {
            // console.log("新增三级数据-成功:", res);
            // 三级新增成功
            // 添加新的4级数据
            if (formState.fileList != null && formState.fileList.length > 0) {
              let len2 = 0;
              await formState.fileList.forEach(async (item3, index3) => {
                let newFour = new FormData();
                let parentKey1 = three;
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
                        message.success("提交成功！");
                        // console.log("success-back");
                        refreshContentData();
                      }
                    } else {
                      // console.log("新增四级数据-失败:", res2);
                      message.error("提交失败！");
                    }
                  })
                  .catch(err2 => {
                    // console.log("新增四级数据-失败:", err2);
                    message.error("提交失败！");
                  });
              });
            } else {
              // 无四级数据
              message.success("提交成功！");
              // console.log("success-back");
              refreshContentData();
            }

          } else {
            // console.log("修改三级数据-失败:", res);
            message.error("提交失败！");
          }
        })
        .catch(err => {
          // console.log("修改三级数据-失败", err);
          message.error("提交失败！");
        });
    }

    // 表单数据提交
    const clickSubmit = async () => {
      // console.log("submit::");
      // console.log(formState);
      // console.log(state.value);
      if (state.value.drawerAdd == false) {
        // 编辑数据
        if (formState.title != null && formState.title != "") {
          // 有名称
          let temptype = "";
          let tempparams = new FormData();
          let tabletype = "";
          tempparams.append("name", formState.title);
          tempparams.append("spec", formState.spec);
          tempparams.append("unit", formState.unit);
          tempparams.append("amt", formState.amt);
          tempparams.append("ps", formState.ps);

          if (formState.type == "basics" || formState.type == "stringing") {
            tabletype = formState.type;
            if (formState.fileList != null && formState.fileList.length > 0) {
              tempparams.append("other", formState.fileList[0].preview);
            }
            // 修改 1
            tempparams.append("id", state.value.currentContentData.id);

            temptype = "set";
          } else if (formState.type == "towerstep") {
            tabletype = "towers";
            tempparams.append("other1", state.value.currentContentData.second);
            if (formState.fileList != null && formState.fileList.length > 0) {
              tempparams.append("other2", formState.fileList[0].preview);
            }
            tempparams.append("id", state.value.currentContentData.id);

            temptype = "set";
          }

          // 修改对应数据
          await getToolData(tabletype, temptype, tempparams).then(res => {
            if (res.code == 200) {
              // console.log("提交数据-成功:", res);
              message.success("提交成功！");
              // console.log("success-back");
              refreshContentData();
            } else {
              // console.log("提交数据-失败:", res);
              message.error("提交失败！");
            }
          }).catch((e) => {
            // console.log("提交数据-失败:", e);
            message.error("提交失败！");
          });
        } else {
          message.error("名称不能为空！")
        }
      }
      else if (state.value.drawerAdd == true) {
        // 新增类别
        if (formState.mainName != null && formState.mainName != "") {
          if (formState.subName != null && formState.subName != "") {
            if (formState.title != null && formState.title != "") {
              // 有名称

              if (formState.second != null && formState.second != "") {
                // 已有类别，新增内容
                let temptype = "";
                let tempparams = new FormData();
                let tabletype = "";
                tempparams.append("name", formState.title);
                tempparams.append("spec", formState.spec);
                tempparams.append("unit", formState.unit);
                tempparams.append("amt", formState.amt);
                tempparams.append("ps", formState.ps);

                if (formState.type == "basics" || formState.type == "stringing") {
                  tabletype = formState.type;
                  if (formState.fileList != null && formState.fileList.length > 0) {
                    tempparams.append("other", formState.fileList[0].preview);
                  }
                  // 新增
                  tempparams.append("id", uuidV4());

                  temptype = "insert";
                } else if (formState.type == "towerstep") {
                  tabletype = "towers";
                  tempparams.append("other1", formState.second);
                  if (formState.fileList != null && formState.fileList.length > 0) {
                    tempparams.append("other2", formState.fileList[0].preview);
                  }
                  tempparams.append("id", uuidV4());

                  temptype = "insert";
                }

                // 新增对应数据
                await getToolData(tabletype, temptype, tempparams).then(res => {
                  if (res.code == 200) {
                    // console.log("提交数据-成功:", res);
                    message.success("提交成功！");
                    // console.log("success-back");
                    refreshContentData();
                  } else {
                    // console.log("提交数据-失败:", res);
                    message.error("提交失败！");
                    refreshContentData();
                  }
                }).catch((e) => {
                  // console.log("提交数据-失败:", e);
                  message.error("提交失败！");
                  refreshContentData();
                });


              } else {
                // 新增2级菜单
                // 新增二级
                let tempparams = new FormData();
                let secondid = uuidV4();
                tempparams.append("id", secondid);
                tempparams.append("name", formState.subName);
                await getToolData("towerstep", "insert", tempparams).then(async res => {
                  if (res.code == 200) {

                    // 新增成功
                    // console.log("新增二级-成功:", res);

                    // 新增内容
                    let temptype = "";
                    let tempparams = new FormData();
                    let tabletype = "";
                    tempparams.append("name", formState.title);
                    tempparams.append("spec", formState.spec);
                    tempparams.append("unit", formState.unit);
                    tempparams.append("amt", formState.amt);
                    tempparams.append("ps", formState.ps);

                    if (formState.type == "basics" || formState.type == "stringing") {
                      tabletype = formState.type;
                      if (formState.fileList != null && formState.fileList.length > 0) {
                        tempparams.append("other", formState.fileList[0].preview);
                      }
                      // 新增
                      tempparams.append("id", uuidV4());

                      temptype = "insert";
                    } else if (formState.type == "towerstep") {
                      tabletype = "towers";
                      tempparams.append("other1", secondid);
                      if (formState.fileList != null && formState.fileList.length > 0) {
                        tempparams.append("other2", formState.fileList[0].preview);
                      }
                      tempparams.append("id", uuidV4());

                      temptype = "insert";
                    }

                    // 新增对应数据
                    await getToolData(tabletype, temptype, tempparams).then(res => {
                      if (res.code == 200) {
                        // console.log("提交数据-成功:", res);
                        message.success("提交成功！");
                        // console.log("success-back");
                        refreshContentData();
                      } else {
                        // console.log("提交数据-失败:", res);
                        message.error("提交失败！");
                        refreshContentData();
                      }
                    }).catch((e) => {
                      // console.log("提交数据-失败:", e);
                      message.error("提交失败！");
                      refreshContentData();
                    });


                    // // console.log("新增成功:", res);
                  } else {
                    // 新增失败
                    // console.log("新增数据-失败:", res);
                    message.error("新增失败")
                    refreshContentData();
                  }
                })
                // })

              }
            } else {
              message.error("内容名称不能为空！")
            }
          } else {
            // 2级菜单
            message.error("子类别名称不能为空！")
          }
        } else {
          // 一级菜单
          message.error("主类别名称不能为空！")
        }

      }


    };

    // 提交表单后刷新数据
    const refreshContentData = async () => {
      await getparams();

      if (state.value.drawerAdd == false) {
        // 编辑页面刷新数据
        let temp = {
          bgimg: "", // 第一个上传的图片/视频
          contenttext: formState.content,
          key: state.value.currentContentData.key,
          medialist: [],
          moreflag: false,
          second: formState.level[1],
          title: formState.title,
          first: formState.level[0],
          spec: formState.spec,
          ps: formState.ps,
          unit: formState.unit,
          amt: formState.amt,
          type: formState.type,
          id: state.value.currentContentData.id,
        }
        if (formState.fileList != null && formState.fileList.length > 0) {
          temp.bgimg = formState.fileList[0].preview;
        }
        // medialist
        if (
          formState.fileList != null &&
          formState.fileList.length > 0
        ) {
          formState.fileList.forEach(async (item3, index3) => {
            let parentKey1 = temp.key;
            let cIndex = index3 + 1;
            let itemIndex = parentKey1 + "-" + cIndex;
            let tempitem = {
              three: parentKey1,
              imgurl: null,
              type: null,
              videourl: null,
              id: null,
              index: itemIndex,
            }

            if (item3.type.indexOf("image") != -1) {
              tempitem.imgurl = item3.preview;
              tempitem.type = "img";
              tempitem.videourl = null;
            } else if (item3.type.indexOf("video") != -1) {
              tempitem.imgurl = null;
              tempitem.type = "video";
              tempitem.videourl = item3.preview;
            }
            temp.medialist.push(tempitem);
          });
        }
        clickContentCard(temp);

        state.value.drawerShow = false;
        clearForm();
      } else {
        state.value.drawerShow = false;
        // 新增页面刷新数据
        clickContentBack();
      }

    }


    // 表单删除按钮
    const clickDelete = async () => {
      // 删除三四级数据
      // 先删4级再删3级
      // 删除所有4级媒体数据
      // console.log("form", formState, state.value.currentContentData)
      let temptype = "";
      let tempform = new FormData();
      tempform.append("id", state.value.currentContentData.id)
      if (formState.type == "basics" || formState.type == "stringing") {
        temptype = formState.type;
      } else if (formState.type == "towerstep") {
        temptype = "towers"
      }

      // 删除数据
      await getToolData(temptype, "delete", tempform).then(async res => {
        if (res.code == 200) {
          // console.log("删除数据-成功:", res);
          message.success("删除成功");
          await refreshContentData();
          clickContentBack();
        } else {
          // console.log("删除数据-失败:", res);
          message.error("删除失败！");
        }
      }).catch((err) => {
        // console.log("删除数据-失败:", err);
        message.error("删除失败！");
      })
    
    }

    // 点击详情页返回按钮
    const clickContentBack = () => {
      state.value.contentFlag = false;
      clearForm();

      setTimeout(() => {
        tabTitleClick(null);
      });
    }

    //  根据选中的一级菜单获取二级菜单
    const selectOneMenu = (value, option) => {
      formState.type = option.value;
      // console.log("selectOneMenu", value, option);
      oldTwoMenuList.value = option.children;
      formState.mainIcon = option.icon;
      formState.mainName = option.label;
      formState.first = option.value;
      formState.subName = "";
      formState.second = "";
      subDisableFlag.value = false;
      if (option.value == "basics" || option.value == "stringing") {
        formState.subName = option.children[0].label;
        formState.second = option.children[0].value;
        subDisableFlag.value = true;
      }

    };

    // 选中二级类别
    const selectTwoMenu = (value, option) => {
      // console.log("selectTwoMenu", value, option);
      formState.subName = option.label;
      formState.second = option.value;
    }

    // 可输入一级菜单名称
    const filterOneOption = (input, option) => {
      // console.log("filterOption1", input, option);
      formState.mainName = input;
      formState.first = "";
      oldTwoMenuList.value = [{ label: "", value: "" }];
      formState.subName = "";
      formState.second = "";

      if (option.label == input) {
        setTimeout(() => {
          selectOneMenu(input, option);
        })
      }
      return option.label.indexOf(input) != -1;
    };
    // 可输入2级菜单名称
    const filterTwoOption = (input, option) => {
      // console.log("filterOption2", input, option);
      formState.subName = input;
      formState.second = "";

      if (option.label == input) {
        setTimeout(() => {
          selectTwoMenu(input, option);
        })
      }
      return option.label.indexOf(input) != -1;


    };
    onMounted(async () => {
      await getparams();
      // 初始化数据
      state.value.selectedKeys = [menuList.value[0].key];
      state.value.selectedIndex = 0;
      state.value.subSelectedKey = menuList.value[0].childMenuList[0].key;
      state.value.subSelectedIndex = 0;
      setTimeout(() => {
        tabTitleClick(1);
      });
      // 监听视频全屏事件
      window.addEventListener('fullscreenchange', function (event) {
        // // console.log("event", event)
        
        if (event.target["id"].toString().indexOf("modalVideoId") != -1) {
          let tempvideo = event.target as HTMLVideoElement;
          if (document.fullscreenElement) {
            // // console.log(`当前为打开全屏模式`, tempvideo.id);
            if (tempvideo.paused) {
              tempvideo.play();
            }
          } else {
            // // console.log('当前为退出全屏模式', tempvideo.id);
            if (!tempvideo.paused) {
              tempvideo.pause();
            }
          }
        }

      });
    });

    return {
      router,
      titleText,
      state,
      menuList,
      searchValue,
      selectMenuColor,
      clickMenu,
      onSearch,
      clickTabButton,
      tabTitleClick,
      leftIcon,
      rightIcon,
      currentPage,
      pageSize,
      changePage,
      searchFlag,
      searchCardClick,
      clickContentCard,
      addIcon,
      editIcon,
      mobileIcon1,
      mobileIcon2,
      mobileIcon3,
      mobileIcon4,
      mobileIcon5,
      icon1,
      icon2,
      icon3,
      icon4,
      icon5,
      formState,
      selectList,
      clearForm,
      getForm,
      baseUrl,
      deleteFile,
      clickSubmit,
      handleCancel,
      handlePreview,
      handleVideoChange,
      clickAdd,
      fileType,
      previewVisible,
      previewImage,
      clickContentBack,
      clickDelete,
      selectOneMenu,
      selectTwoMenu,
      oldTwoMenuList,
      filterOneOption,
      filterTwoOption,
      openFlag,
      subDisableFlag
    };
  }
};
</script>
<style scoped lang="less">
.mainPage {
  height: 100%;
  overflow-x: hidden;
}

.leftArea {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: url("/picture/pc/bg_架线2.png");
  background-repeat: no-repeat;
  background-size: cover;

  .titleLogo {
    width: 40px;
    margin-top: 20px;
  }

  .titleFont {
    font-size: 20px;
    font-family: "YouSheBiaoTiHei";
    color: #fff;
    white-space: pre-wrap;
    line-height: 20px;
  }

  .searchLogo {
    width: 15px;
    margin-right: 5px;
  }

  .searchInput {
    background: transparent;
    border-bottom: solid 1px rgba(255, 255, 255, 0.5);
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    width: 90%;
    margin: 10px 0px;

    :deep(.ant-input) {
      color: rgba(255, 255, 255, 1);
    }

    ::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .menuArea {
    background: transparent;

    .menuItem {
      position: relative;

      .menuIcon {
        width: 20px;
        height: 20px;
        position: absolute;
        top: calc(50% - 10px);
        left: 10px;
      }

      .menuFont {
        height: 30px;
        position: absolute;
        top: 0px;
        left: 40px;
        color: #fff;
        font-weight: 600;
      }
    }

    :deep(.ant-menu-item) {
      border-radius: 5px 0px 0px 5px;
      margin-left: 10px;
    }

    :deep(.ant-menu-item-selected) {
      background: rgb(245, 245, 245);

      .menuFont {
        color: #5092F4;
      }
    }

    :deep(.ant-menu-item-active) {}
  }
}

.rightContentArea {
  margin: 10px 20px;
  height: 100%;
  width: auto;

  .contentTab {
    width: 100%;
    height: 100%;

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

    .tabTitleArea {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #fff;
      position: relative;
      border-radius: 5px;
      width: calc(100% - 100px);

      .tabButton {
        width: 10px;
        margin: 20px;
      }

      .tabTitle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: calc(100% - 100px);
      }
    }

    .addButton {
      position: absolute;
      right: -100px;
      margin-left: 10px;
      width: 80px;
      height: 40px;
      background: rgb(80, 146, 244);

      .addContent {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;

        .addImg {
          width: 20px;
          margin-right: 5px;
        }
      }
    }
  }

  :deep(.ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-list) {
    overflow-x: hidden;
  }

  .contentArea {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: auto;
    justify-content: center;
    height: 100%;
    position: relative;

    .contentCardArea {
      overflow: auto;
      height: calc(100% - 70px);
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .contentItemArea {
        min-width: 120px;
        background: #fff;
        border-radius: 10px;
        margin: 10px;
        width: calc(100% - 40px);
        height: calc(30vh - 50px);

        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: space-between;

        .contentItemBackground {
          background: rgba(153, 153, 153, 0.1);
          z-index: 1;
          min-width: 120px;
          margin-right: 10px;
          width: calc(25% - 10px);
          border-radius: 10px 0px 0px 10px;
          height: calc(100% - 0px);
          background-repeat: no-repeat;
          border: rgba(153, 153, 153, 0.3) 1px solid;

          background-size: cover;
        }

        .contentItemTextArea {
          display: flex;
          margin: 10px;
          height: calc(100% - 20px);
          width: calc(37% - 20px);
          text-align: left;
          overflow: hidden;
          z-index: 2;

          .contentItemText {
            width: 100%;
            height: 100%;
            justify-content: center;
            display: flex;
            flex-direction: column;

            .contentFont {
              margin: 30px 20px;
              text-align: left;
            }
          }
        }

        .showMore {
          position: absolute;
          z-index: 2;
          bottom: 65px;

          width: calc(100% - 20px);
          color: rgb(80, 146, 244);
        }


        .contentItemTitle {
          
          width: calc(25% - 10px);
          height: 30%;
          position: absolute;
          bottom: 0px;
          left: 0px;
          background: rgba(2, 2, 2, 0.4);
          border-radius: 0px 0px 0px 10px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: medium;
        }

      }
    }

    .searchCardArea {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 130px);

      overflow: auto;
      padding-top: 30px;

      .searchItemArea {
        background: #fff;
        height: 20vh;
        min-height: 110px;
        margin: 10px;
        width: calc(100% - 20px);
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

    .pageArea {
      margin-top: 10px;

      :deep(.ant-pagination-prev) {
        background: #fff;
      }

      :deep(.ant-pagination-item) {
        background: #fff;
      }

      :deep(.ant-pagination-next) {
        background: #fff;
      }

      :deep(.ant-pagination-item-active) {
        background: rgb(80, 146, 244);
        border-color: #fff;
      }

      :deep(.ant-pagination-item-active a) {
        color: #fff;
      }
    }
  }
}

// 内容页
// 编辑按钮
.editButton {
  width: 80px;
  height: 40px;
  background: rgb(80, 146, 244);

  .editContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;

    .editImg {
      width: 15px;
      margin-right: 5px;
    }
  }
}

// 按钮hover颜色
.editButton.ant-btn-primary:not(:disabled):hover {
  background: rgb(80, 146, 244);
}

// 图片区域
.imgArea {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  margin: 20px;
  width: calc(30% - 40px);
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.imgItem {
  width: calc(100% - 20px);
  margin: 10px;
  height: calc(30% - 0px);
  max-height: calc(30% - 0px);
}

.imgItem1 {
  width: 100%;
  height: 100%;
  max-height: calc(30% - 0px);
}

// 滚动条移入显示
.imgArea:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.imgArea::-webkit-scrollbar {
  width: 6px;
  height: 0px;
}

// 内容区域
.textArea {
  height: calc(100% - 40px);
  margin: 20px;
  width: calc(70% - 40px);
  overflow-y: auto;
  max-height: calc(100vh - 120px);

  .contentItemText {

    .contentFont {
      margin: 30px 20px;
      text-align: left;
    }
  }

}

// 滚动条移入显示
.textArea:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.textArea::-webkit-scrollbar {
  width: 6px;
  height: 0px;
}

:deep(.ant-form-item .ant-form-item-label >label) {
  color: rgb(144, 149, 156);
}

// 表单提交按钮
.submitButton {
  width: 80px;
  background: rgb(80, 146, 244);
}

// 按钮hover颜色
.submitButton.ant-btn-primary:not(:disabled):hover {
  background: rgb(80, 146, 244);
}

// 上传按钮
.uploadButton {
  width: 80px;
  height: 32px;
  background: rgb(80, 146, 244);

  .uploadContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;

    .uploadImg {
      width: 15px;
      margin-right: 5px;
    }
  }
}

// 按钮hover颜色
.uploadButton.ant-btn-primary:not(:disabled):hover {
  background: rgb(80, 146, 244);
}

// 上传文件列表样式

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
  margin-top: 10px;
  margin-left: -10px;
  width: calc(100% + 20px);
}

:deep(.ant-upload-wrapper .ant-upload-list::before) {
  content: none;
}

:deep(.ant-upload .ant-upload-select .ant-upload-select-text) {
  max-width: 120px;
  max-height: 120px;
}

// 弹窗中水平线样式
.modalDivider {
  color: rgb(153, 153, 153);
  font-size: 14px;
  margin: 0px 0px 10px 0px;
}

// 表单icon
.iconImg {
  width: 90%;
}

// 图标单选框
.radioArea {
  width: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
  