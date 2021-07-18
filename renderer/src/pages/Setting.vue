<template>
  <div class="setting-page">
    <n-form label-placement="left">
      <n-form-item label="开启代理">
        <n-switch v-model:value="config.proxy" />
      </n-form-item>
      <n-form-item label="">
        <n-input-group>
          <n-input-group-label>IP：</n-input-group-label>
          <n-input
            :disabled="!config.proxy"
            placeholder="请输入IP地址"
            v-model:value="config.ip"
          />
          <n-input-group-label>port：</n-input-group-label>
          <n-input
            :disabled="!config.proxy"
            placeholder="请输入端口号"
            :style="{ width: '30%' }"
            v-model:value="config.port"
          />
        </n-input-group>
      </n-form-item>
      <n-form-item label="下载地址">
        <n-input-group>
          <n-input
            type="input"
            placeholder="请选择下载保存目录"
            v-model:value="config.downloadFolder"
          />
          <n-button type="primary" ghost @click="showOpenDialog">选择</n-button>
        </n-input-group>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

interface Config {
  proxy: boolean;
  ip: string;
  port: string;
  downloadFolder: string;
}

let config = ref<Config>({
  proxy: false,
  ip: "",
  port: "",
  downloadFolder: "",
});
onMounted(() => {
  window.ipcRenderer.invoke("readFile", "config.json").then((res: string) => {
    if (typeof res === "string") {
      const setting = JSON.parse(res);
      config.value = { ...setting };
    } else {
      console.log(res);
    }
  });
});
onBeforeRouteLeave(() => {
  window.ipcRenderer
    .invoke("writeFile", {
      fileName: "config.json",
      fileContent: JSON.stringify(config.value),
    })
    .then((res) => {
      console.log(res);
    });
});
function showOpenDialog() {
  window.ipcRenderer
    .invoke("showOpenDialog", {
      properties: ["openDirectory", "createDirectory"],
    })
    .then((res: string[]) => {
      console.log(res);
      config.value.downloadFolder = res[0];
    });
}
</script>
<style scoped>
.setting-page {
  padding: 60px;
}
</style>
