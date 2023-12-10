<template>
    <div class="tagBlock">
        <tagHeaderVue :title="$t('defaultTag.sort')" :conditionItem="[]" @updateDeployableState="updateDeployableState">
        </tagHeaderVue>
        <div v-if="tagDeployableState" class="tagList fixedWidth">
            <tagSpan v-for="item in dataset.sortMode" :key="item" :text="$t('defaultTag.sortMode.' + item)"
                :select="selectFn(item)" @click="selectHandle(item)"></tagSpan>
        </div>
    </div>
</template>
<script setup lang="ts">
import tagHeaderVue from "./tagHeader.vue"
import tagSpan from "../smallCom/tagSpan.vue"
import dataset from "@/assets/dataset";
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { ref } from 'vue'
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
}
const tagDeployableState = ref(true);
const updateDeployableState = (deployableState: boolean) => {
    tagDeployableState.value = deployableState;
}

const selectFn = (item: string) => {
    if (item == store.filesBasesSettingStore.config.sortMode) {
        return true;
    }
    return false;
}

const selectHandle = (item: string) => {
    store.filesBasesSettingStore.config.sortMode = item;
}
</script>
<style scoped>
.tagBlock .tagList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
</style>