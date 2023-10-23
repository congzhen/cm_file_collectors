<template>
    <el-dialog class="mainDialog" v-model="dialogVisible"
        :title="$t('performer.recycle', { title: store.filesBasesSettingStore.getPerformerText })" width="900px"
        :close-on-click-modal="false" append-to-body>
        <el-table :data="dataList" height="500px" size="small" :border="true" :show-header="false" style="width: 100%">
            <el-table-column prop="id" width="160" :show-overflow-tooltip="true" />
            <el-table-column prop="name" width="180" :show-overflow-tooltip="true" />
            <el-table-column prop="aliasName" :show-overflow-tooltip="true" />
            <el-table-column width="160">
                <template #default="scope">
                    <el-button size="small" type="warning" icon="RefreshLeft" @click="handleRestore(scope.row)">{{
                        $t('performer.infoBtn.restore') }}</el-button>
                    <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row)">{{
                        $t('performer.infoBtn.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import setupConfig from "@/setup/config";
import { Iperformer } from '@/dataInterface/performer.interface';
import { performerStore } from '@/store/performer.store';
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import restoreConfirm from "@/components/common/funRestoreConfirm"
import deleteConfirm from "@/components/common/funDeleteConfirm"
import { performerServerData } from '@/serverData/performer.serverData';
import { ref, computed, inject } from 'vue'
import { deleteFile } from '@/assets/file';
import { performerFaceFolderPath } from '@/assets/fileDbFolder';
const updatePerformerAdminMainData = inject<() => void>('updatePerformerAdminMainData');
const store = {
    performerStore: performerStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
const dialogVisible = ref(false);
const nowPerformerBasesId = ref('');

const dataList = computed(() => {
    if (nowPerformerBasesId.value == '') {
        return [];
    }
    return store.performerStore.performerList.filter(per => per.performerBases_id == nowPerformerBasesId.value && !per.status);
})

const handleRestore = (per: Iperformer) => {
    restoreConfirm.exec(per.name, async () => {
        loading.open();
        await performerServerData.setStatus(per.id, true);
        store.performerStore.setStatus(per.id, true);
        if (updatePerformerAdminMainData) updatePerformerAdminMainData();
        await loading.closeSync();
    });
}

const handleDelete = (per: Iperformer) => {
    deleteConfirm.exec(per.name, async () => {
        loading.open();
        const rd = await performerServerData.delete(per.id);
        if (rd) {
            store.performerStore.delete(per.id);
            if (per.photo != '') {
                deleteFile(performerFaceFolderPath(per.performerBases_id), per.photo)
            }
        }
        await loading.closeSync();
    });
};

const open = (_nowPerformerBasesId: string) => {
    nowPerformerBasesId.value = _nowPerformerBasesId;
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped></style>