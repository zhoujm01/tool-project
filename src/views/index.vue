<template>
  <div class="page">
    <div class="background" @click="() => {
      router.push('/toolPage');
    }">
      <div class="pictureWide">
        <img src="/picture/title4.png" class="titlePicture" />
      </div>
      <div class="pictureVertical">
        <img src="/picture/title4.png" class="titlePicture" />
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const enterPage = () => {
  router.push("/judgePage");

};
</script>
<style lang="less" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* 确保超出部分被裁剪 */
}

.background {
  overflow: hidden;
  /* 确保超出部分被裁剪 */
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: relative;
}

.titlePicture {
  height: auto;
  object-fit: cover;
  /* 新增，确保图片填充整个容器 */
  zoom: 2;
  margin-top: 15vh;
}

.pictureWide {
  z-index: 1;
}

.pictureVertical {
  z-index: 1;
}

.buttonArea {
  position: absolute;
  bottom: 10%;
  left: 0px;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.pageButton {
  width: 300px;
  height: 40px;
  background: rgb(0, 190, 201);
  z-index: 2;
  margin: 5px;
}

:deep(.ant-btn-primary:not(:disabled):hover) {
  background: rgb(0, 190, 201);
}

@media screen and (max-width: 750px) {
  .titlePicture {
    width: 70%;
    max-width: 200px;
  }

  .pictureWide {
    display: none;
  }

  .pictureVertical {
    overflow: hidden;
    /* 确保超出部分被裁剪 */

    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 新增，确保图片填充整个容器 */

    background: url("/picture/verticalScreenBackground2.png") center no-repeat;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
}

@media screen and (min-width: 750px) {
  .titlePicture {
    width: 60%;
    max-width: 250px;
  }

  .pictureWide {
    overflow: hidden;
    /* 确保超出部分被裁剪 */

    background: url("/picture/wideScreenBackground2.png") center no-repeat;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 新增，确保图片填充整个容器 */
  }

  .pictureVertical {
    display: none;
  }
}
</style>