<template>
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
import { ref, onMounted, provide } from 'vue';
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
  await store.tagClassStore.init();
  await store.tagStore.init();
  await store.performerStore.init();
  store.performerStore.currentAdminPerformerBases_id = store.filesBasesStore.getCurrentFilesMainPerformerBasesId;
  displayStatus.value = true;
  await loading.closeSync();
  console.log(store);
  callBack();
}


onMounted(async () => {
  ipcRendererSend.mainStartup();
  await AppInit();
})
provide('AppInit', AppInit);
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

.is-fullscreen .el-dialog__body {
  height: calc(100% - 80px);
}
</style>
