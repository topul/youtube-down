<template>
  <div class="download-page">
    <n-form
      class="download-form"
      label-placement="left"
      label-width="100"
      :model="formValue"
      :rules="rules"
      ref="formRef"
    >
      <n-form-item label="视频地址" path="url">
        <n-input-group>
          <n-input placeholder="请输入视频地址" v-model:value="formValue.url" />
          <n-button
            type="primary"
            :loading="formValue.infoLoading"
            @click="getVideoInfo"
            >获取视频信息</n-button
          >
        </n-input-group>
      </n-form-item>
      <n-form-item label="播放列表位置" v-if="formValue.showPlaylist">
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
        <n-select
          v-model:value="formValue.formatNote"
          :options="formValue.formatsNote"
        />
      </n-form-item>
      <n-form-item label="视频格式">
        <n-select
          v-model:value="formValue.ext"
          :options="formValue.formatsExt"
        />
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
import { NForm, useNotification } from "naive-ui";
import { reactive, ref } from "vue";
import { FormValue, VideoInfo } from "./Video";

export default {
  setup() {
    const notification = useNotification();
    const formRef = ref<InstanceType<typeof NForm>>();
    const formValue = reactive<FormValue>({
      url: "",
      showPlaylist: false,
      startPlaylist: 1,
      endPlaylist: 1,
      thumbnail: true,
      formatNote: "",
      ext: "",
      formatsNote: [],
      formatsExt: [],
      infoLoading: false,
      downloadLoading: false,
    });

    function getVideoInfo(e: MouseEvent) {
      e.preventDefault();
      formValue.infoLoading = true;
      window.ipcRenderer
        .invoke("getVideoInfo", { url: formValue.url })
        .then((res: VideoInfo) => {
          console.log(res);
          // 根据thumbnail和formatNote存储对应的视频和缩略图
          if (res._type && res._type === "playlist") {
            // 是一个播放列表
          } else {
            // 单个视频
            // 过滤出视频文件
            res.formats.forEach((format) => {
              if (format.format_note !== "tiny") {
                formValue.formatsNote.push({
                  label: `${format.format_note}_${format.ext}`,
                  value: `${format.format_id}`,
                });
                const d = formValue.formatsExt.find(
                  (obj) => obj.value === format.ext
                );
                if (!d) {
                  formValue.formatsExt.push({
                    label: `${format.ext}`,
                    value: `${format.ext}`,
                  });
                }
              }
            });
          }
        })
        .finally(() => {
          formValue.infoLoading = false;
        });
    }

    function handleDownload(e: MouseEvent) {
      e.preventDefault();
      formValue.downloadLoading = true;
      // https://youtu.be/6HUjDKVn0e0
      console.log("download clicked", {
        formNote: formValue.formatNote,
        ext: formValue.ext,
      });
      formRef.value.validate((errors) => {
        if (!errors) {
          window.ipcRenderer
            .invoke("download", {
              formNote: formValue.formatNote,
              ext: formValue.ext,
              url: formValue.url,
            })
            .then((res: boolean) => {
              console.log(res);
              if (res) {
                notification.success({
                  content: "下载成功",
                });
              } else {
                notification.error({
                  content: "下载失败，请查阅日志",
                });
              }
              // 根据thumbnail和formatNote存储对应的视频和缩略图
            })
            .finally(() => {
              formValue.downloadLoading = false;
            });
        } else {
          console.log(errors);
        }
      });
    }
    return {
      handleDownload,
      getVideoInfo,
      formValue,
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
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.download-form {
  width: 100%;
}
.download-page-button {
  width: 100%;
}
</style>
