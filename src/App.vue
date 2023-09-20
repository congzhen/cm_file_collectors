<template >
  <indexView v-if="displayStatus" />
</template>
<script setup lang="ts">
import { ipcRendererSend } from "@/electronCommon"
import indexView from "@/views/IndexView.vue"
import { filesBasesStore } from "@/store/filesBases.store";
import { performerBasesStore } from "@/store/performerBases.store";
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store"
import { tagClassStore } from "@/store/tagClass.store";
import { tagStore } from "@/store/tag.store";
import { performerStore } from "./store/performer.store";
import loading from '@/assets/loading'
import { useDark, useToggle } from '@vueuse/core'
import { ref, onMounted, provide } from 'vue';
import { softWareConfigData } from "./setup/softwareConfig";
const displayStatus = ref(false);
const store = {
  filesBasesStore: filesBasesStore(),
  performerBasesStore: performerBasesStore(),
  filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
  filesBasesSettingStore: filesBasesSettingStore(),
  tagClassStore: tagClassStore(),
  tagStore: tagStore(),
  performerStore: performerStore(),
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AppInit = async (_currentFilesBases_id: string | undefined = undefined, callBack = () => { }) => {
  loading.open();
  await store.filesBasesStore.init(_currentFilesBases_id);
  await store.performerBasesStore.init();
  await store.filesRelatedPerformerBasesStore.init();
  await store.filesBasesSettingStore.init(store.filesBasesStore.currentFilesBases.id);
  await AppInitData();
  store.performerStore.currentAdminPerformerBases_id = store.filesBasesStore.getCurrentFilesMainPerformerBasesId;
  displayStatus.value = true;
  await loading.closeSync();
  console.log(store);
  callBack();
}

const AppInitData = async () => {
  await store.tagClassStore.init();
  await store.tagStore.init();
  await store.performerStore.init();
}

const useTheme = () => {
  const theme = softWareConfigData.theme == 'dark' ? 'dark' : 'light';
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueLight: theme,
  })
  useToggle(isDark)
}

onMounted(async () => {
  useTheme();
  ipcRendererSend.mainStartup();
  await AppInit();
})
provide('AppInit', AppInit);
provide('AppInitData', AppInitData);
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

input {
  spellcheck: false;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}

.mainDialog .el-dialog__body {
  padding: 5px 20px 20px 20px;
}

.mainDialog .el-dialog__footer {
  padding: 0px 20px 20px 20px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* 滚动块 */
::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

/* 悬停状态下滚动块 */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #eee;
  border-radius: 5px;
}

/* 滚动条轨道悬停状态 */
::-webkit-scrollbar-track:hover {
  background: #ccc;
}

/* 滚动条角落 */
::-webkit-scrollbar-corner {
  background: #eee;
}
</style>
