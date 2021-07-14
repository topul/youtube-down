<template>
  <n-notification-provider>
    <home />
  </n-notification-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NNotificationProvider } from "naive-ui";
import Home from "./pages/Home.vue";

export default defineComponent({
  name: "App",
  components: { Home, NNotificationProvider },
});
</script>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
