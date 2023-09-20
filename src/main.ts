import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './router'

import { init, i18n } from "@/setup/init";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import { VueMasonryPlugin } from 'vue-masonry';


import './style/dark.style.scss'

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus, { locale: zhCn }).use(i18n).use(pinia).use(router).use(VueMasonryPlugin);


init(() => {
    app.mount("#app");
})