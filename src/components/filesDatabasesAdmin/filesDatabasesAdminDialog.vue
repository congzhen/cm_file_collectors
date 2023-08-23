<template>
    <div>
        <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('filesDatabases.title')" width="1260px"
            :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
            <filesDatabasesAdminMain class="filesDatabasesAdminMain"></filesDatabasesAdminMain>
            <template #footer>
                <div class="buttonGroup">
                    <div>
                        <el-button @click="openDramaSeriesPathReplacer">{{ $t('dramaSeriesPathReplacer.title')
                        }}</el-button>
                    </div>
                    <div>
                        <el-button @click="dialogVisible = false">{{ $t('filesDatabases.cancel') }}</el-button>
                        <el-button type="success" @click="handleAddFilesDatabases">{{ $t('filesDatabases.add')
                        }}</el-button>
                    </div>
                </div>

            </template>
        </el-dialog>
    </div>
    <filesDatabasesAdminAdd ref="filesDatabasesAdminAddRef"></filesDatabasesAdminAdd>
    <dramaSeriesPathReplacer ref="dramaSeriesPathReplacerRef"></dramaSeriesPathReplacer>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import filesDatabasesAdminMain from './filesDatabasesAdminMain.vue';
import filesDatabasesAdminAdd from './filesDatabasesAdminAdd.vue';
import dramaSeriesPathReplacer from '../pageCom/dramaSeriesPathReplacer.vue';
import { ref } from 'vue'
const filesDatabasesAdminAddRef = ref<InstanceType<typeof filesDatabasesAdminAdd>>();
const dramaSeriesPathReplacerRef = ref<InstanceType<typeof dramaSeriesPathReplacer>>();
const dialogVisible = ref(false);
const open = () => {
    dialogVisible.value = true;
}
const handleAddFilesDatabases = () => {
    filesDatabasesAdminAddRef.value?.open('add');
}

const openDramaSeriesPathReplacer = () => {
    dramaSeriesPathReplacerRef.value?.open();
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
.filesDatabasesAdminMain {
    width: 100%;
    height: 500px;
}

.buttonGroup {
    display: flex;
    justify-content: space-between;
}
</style>