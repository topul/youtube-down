import { createApp } from "vue";
import Routes from "./router/router";
import App from "./App.vue";
import NaiveUi from "./components/NaiveUi";
import { create } from "naive-ui";
import "./index.css";

const naive = create({
  components: Object.values(NaiveUi).map((item) => item),
});

const app = createApp(App);
app.use(Routes);
app.use(naive);
app.mount("#app");
