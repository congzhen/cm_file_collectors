<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('import.title.simple')" width="800px"
        :close-on-click-modal="false" :fullscreen="fullscreen()" @close="close" append-to-body>
        <div class="settingMainDiv">
            <el-scrollbar height="520px">
                <importMain ref="importMainRef"></importMain>
            </el-scrollbar>
        </div>
        <template #footer>
            <div class="buttonGroup">
                <div>
                    <el-button @click="dialogVisible = false">{{ $t('import.cancel') }}</el-button>
                    <el-button type="primary" @click="handleAdd">{{ $t('import.submit')
                    }}</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import importMain from './importMain.vue';
import { ref, nextTick } from 'vue'
const dialogVisible = ref(false)
const importMainRef = ref<InstanceType<typeof importMain>>();


const open = () => {

    dialogVisible.value = true;
    nextTick(() => {
        importMainRef.value?.open();
    })

}

const close = () => {
    importMainRef.value?.saveSimpleConfig();
}

const handleAdd = () => {
    importMainRef.value?.submit();
}

const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
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
.settingMainDiv {
    width: 100%;
    height: 520px;
}

.buttonGroup {
    display: flex;
    justify-content: flex-end;
}
</style>