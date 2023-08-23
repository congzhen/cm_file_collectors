<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('performer.admin')" width="1280px"
        :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
        <performerAdminMain ref="performerAdminMainRef"></performerAdminMain>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import performerAdminMain from "./performerAdminMain.vue"
import { ref, nextTick } from 'vue'
const performerAdminMainRef = ref<InstanceType<typeof performerAdminMain>>();
const dialogVisible = ref(false)

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
<style scoped></style>