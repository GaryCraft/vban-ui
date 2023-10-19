import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(mdiVue, {
	icons: mdijs
});
app.mount("#app");
