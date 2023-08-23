<template>
    <div>
        <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('performerDatabases.title')" width="1080px"
            :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
            <performerDatabasesAdminMain class="performerDatabasesAdminMain"></performerDatabasesAdminMain>
            <template #footer>
                <div class="buttonGroup">
                    <div>
                        <el-button @click="importPerformerDatabases">{{ $t('performerDatabases.importPerformerDatabases')
                        }}</el-button>
                    </div>
                    <div>
                        <el-button @click="dialogVisible = false">{{ $t('performerDatabases.cancel') }}</el-button>
                        <el-button type="success" @click="handleAddPerformerDatabases">{{ $t('performerDatabases.add')
                        }}</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
        <performerDatabasesAdminAdd ref="performerDatabasesAdminAddRef"></performerDatabasesAdminAdd>
    </div>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import { ipcRendererSend } from "@/electronCommon"
import loading from '@/assets/loading'
import { importPerformer } from '@/assets/performerExportAndImport'
import { ElMessage } from 'element-plus'
import performerDatabasesAdminMain from './performerDatabasesAdminMain.vue';
import performerDatabasesAdminAdd from './performerDatabasesAdminAdd.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const performerDatabasesAdminAddRef = ref<InstanceType<typeof performerDatabasesAdminAdd>>();
const dialogVisible = ref(false);
const open = () => {
    dialogVisible.value = true;
}
const handleAddPerformerDatabases = () => {
    performerDatabasesAdminAddRef.value?.open('add')
}

const importPerformerDatabases = () => {
    const fileName = ipcRendererSend.dialogGetFileSync();
    if (fileName != undefined) {
        loading.open();
        setTimeout(async () => {
            const rd = await importPerformer(fileName);
            await loading.closeSync();
            if (rd === false) {
                ElMessage({
                    message: t('performerDatabases.message.importError'),
                    type: 'error',
                })
            } else {
                ElMessage({
                    message: t('performerDatabases.message.importSuccess', rd),
                    type: 'success',
                })
            }

        }, 500);

    }
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
.performerDatabasesAdminMain {
    width: 100%;
    height: 500px;
}

.buttonGroup {
    display: flex;
    justify-content: space-between;
}
</style>