<template>
  <div class="download-page">
    <n-form
      label-placement="left"
      label-width="100"
      :model="formValue"
      :rules="rules"
      ref="formRef"
    >
      <n-form-item label="视频地址" path="url">
        <n-input placeholder="请输入视频地址" v-model:value="formValue.url" />
      </n-form-item>
      <n-form-item label="播放列表位置">
        <n-input-group>
          <n-input-number v-model:value="formValue.startPlaylist" />
          <n-input-number v-model:value="formValue.endPlaylist" />
        </n-input-group>
      </n-form-item>
      <n-form-item label="下载缩略图">
        <n-space>
          <n-switch v-model:value="formValue.thumbnail" />
        </n-space>
      </n-form-item>
      <n-form-item label="清晰度">
        <n-space vertical>
          <n-select v-model:value="formValue.formatNote" :options="formats" />
        </n-space>
      </n-form-item>
      <n-form-item>
        <n-button
          type="primary"
          size="large"
          class="download-page-button"
          @click="handleDownload"
          >下载</n-button
        >
      </n-form-item>
    </n-form>
  </div>
</template>
<script lang="ts">
import { ref } from "vue";
import DownloadFormatNote from "./DownloadFormatNote";

export default {
  setup() {
    const formRef = ref(null);
    const formValue = ref({
      url: "",
      startPlaylist: 1,
      endPlaylist: 1,
      thumbnail: true,
      formatNote: "720p",
    });
    function handleDownload(e) {
      e.preventDefault();
      // https://youtu.be/6HUjDKVn0e0
      console.log("download clicked", { ...formValue.value });
      formRef.value.validate((errors) => {
        if (!errors) {
          (window as any).ipcRenderer
            .invoke("download", { ...formValue.value })
            .then((res) => {
              console.log(res);
              // 根据thumbnail和formatNote存储对应的视频和缩略图
            });
        } else {
          console.log(errors);
        }
      });
    }
    return {
      handleDownload,
      formValue,
      formats: DownloadFormatNote,
      formRef,
      rules: {
        url: {
          required: true,
          message: "请输入要下载的视频地址",
          trigger: ["blur"],
        },
      },
    };
  },
};
</script>
<style scoped>
.download-page {
  /* width: 80%; */
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.download-page-button {
  width: 100%;
}
</style>
