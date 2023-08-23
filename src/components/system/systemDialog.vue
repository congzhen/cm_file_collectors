<template>
    <el-dialog class="mainDialog" v-model="dialogVisible"
        :title="softwareInformation.softwareName + ' ' + softwareInformation.version" width="800px"
        :close-on-click-modal="false" @close="closeSave" :fullscreen="fullscreen()" append-to-body>
        <div class="systemMainDiv">
            <systemMain ref="systemMainRef"></systemMain>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import systemMain from "./systemMain.vue"
import softwareInformation from "@/setup/softwareInformation"

import { ref } from 'vue'
const systemMainRef = ref<InstanceType<typeof systemMain>>();
const dialogVisible = ref(false)

const closeSave = () => {
    systemMainRef.value?.saveSystem();
}

const open = () => {
    dialogVisible.value = true;
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
.systemMainDiv {
    width: 100%;
    height: 555px;
}
</style>