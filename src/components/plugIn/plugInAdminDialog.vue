<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('pluginAdmin.title')" width="800px"
        :close-on-click-modal="false" append-to-body>
        <plugInAdminTable></plugInAdminTable>
        <template #footer>
            <span class="dialog-footer">
                <el-button size="small" @click="openPluginFolder">{{ $t('pluginAdmin.btn.openPluginFolder') }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { elShell } from '@/electronCommon';
import setupConfig from "@/setup/config"
import plugInAdminTable from './plugInAdminTable.vue';
import { ref, nextTick } from 'vue';
const dialogVisible = ref(false);

const openPluginFolder = async () => {
    await elShell.openPath(setupConfig.pluginPath);
}

const open = () => {
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
});
</script>
