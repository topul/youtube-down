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
    </n-form>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
const config = ref({
  proxy: false,
  ip: "",
  port: "",
});
onMounted(() => {
  (window as any).ipcRenderer.invoke("readFile", "config.json").then((res) => {
    if (typeof res === "string") {
      const setting = JSON.parse(res);
      config.value = setting;
    } else {
      console.log(res);
    }
  });
});
onBeforeRouteLeave(() => {
  (window as any).ipcRenderer
    .invoke("writeFile", {
      fileName: "config.json",
      fileContent: JSON.stringify(config.value),
    })
    .then((res) => {
      console.log(res);
    });
});
</script>
<style scoped>
.setting-page {
  padding: 60px;
}
</style>
