<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="title" width="1405px" :fullscreen="fullscreen()"
        :close-on-click-modal="false" top="12vh" append-to-body>
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

const fullscreen = () => {
    if (window.innerWidth < 1410 || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
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