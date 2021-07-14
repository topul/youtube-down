<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          v-model:value="activeKey"
          @update:value="handleUpdateValue"
        />
      </n-layout-sider>
      <n-layout>
        <router-view />
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { h, Ref, ref, watch } from "vue";
import { NIcon, NLayout, NSpace, NLayoutSider, NMenu } from "naive-ui";
import {
  VideocamOutline as VideoIcon,
  SettingsOutline as SettingIcon,
  DownloadOutline as DownloadIcon,
} from "@vicons/ionicons5";
import { useRoute, useRouter } from "vue-router";

interface MenuValueItem {
  label: string;
  key: string;
  icon: () => {};
}

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: "视频",
    key: "video",
    icon: renderIcon(VideoIcon),
  },
  {
    label: "任务",
    key: "download",
    icon: renderIcon(DownloadIcon),
  },
  {
    label: "设置",
    key: "setting",
    icon: renderIcon(SettingIcon),
  },
];

export default {
  components: { NLayout, NSpace, NLayoutSider, NMenu },
  setup() {
    const collapsed: Ref<boolean> = ref(true);
    const router = useRouter();
    const route = useRoute();
    const activeKey: Ref<string> = ref("video");

    function handleUpdateValue(key: string, item: MenuValueItem): void {
      router.push(`/${key}`);
    }

    const stop = watch(route, (key) => {
      // 侦听一次，防止用户刷新后侧边栏定位错误
      activeKey.value = key.path.slice(1);
      stop();
    });

    return {
      activeKey,
      collapsed,
      menuOptions,
      handleUpdateValue,
    };
  },
};
</script>

<style></style>
