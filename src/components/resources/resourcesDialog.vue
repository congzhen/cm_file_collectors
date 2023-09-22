<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="title" :width="getDialogWidth()"
        :fullscreen="fullscreen()" :close-on-click-modal="false" top="12vh" append-to-body>
        <div class="resourcesMainDiv">
            <resroucesMain ref="resroucesMainRef" @close="dialogVisible = false"></resroucesMain>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import { Iresources } from "@/dataInterface/resources.interface";
import resroucesMain from "./resroucesMain.vue"
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const resroucesMainRef = ref<InstanceType<typeof resroucesMain>>();
const dialogVisible = ref(false)
const mode = ref('add');
const title = computed(() => {
    return mode.value == 'add' ? t('resources.title.add') : t('resources.title.edit');
})

const open = (_mode: string, id: string | undefined = undefined, resInfo: Iresources | undefined = undefined) => {
    dialogVisible.value = true;
    mode.value = _mode;
    nextTick(() => {
        resroucesMainRef.value?.open(_mode, id, resInfo);
    })

}

const getDialogWidth = () => {
    if (window.innerWidth < 1405) {
        return '1280px';
    }
    return '1405px';
}

const fullscreen = () => {
    let stauts = false;
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        stauts = true;
    }
    nextTick(() => {
        resroucesMainRef.value?.showMode(stauts, (window.innerHeight - 200));
    })
    return stauts;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped>
.resourcesMainDiv {
    width: 100%;
    min-height: 555px;
}
</style>