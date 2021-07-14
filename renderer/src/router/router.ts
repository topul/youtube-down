import { createRouter, createWebHashHistory } from "vue-router";
import Download from "../pages/Download.vue";
import Video from "../pages/Video.vue";
import Setting from "../pages/Setting.vue";

const routes = [
  { path: "/", redirect: "/video" },
  { path: "/video", component: Video },
  { path: "/download", component: Download },
  { path: "/setting", component: Setting },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
