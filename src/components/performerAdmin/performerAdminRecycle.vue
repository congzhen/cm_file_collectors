<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('performer.recycle')" width="800px"
        :close-on-click-modal="false" append-to-body>
        <el-table :data="dataList" height="500px" size="small" :border="true" :show-header="false" style="width: 100%">
            <el-table-column prop="name" width="180" />
            <el-table-column prop="aliasName" />
            <el-table-column width="100">
                <template #default="scope">
                    <el-button size="small" type="warning" icon="RefreshLeft" @click="handleRestore(scope.row)">{{
                        $t('performer.infoBtn.restore') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { Iperformer } from '@/dataInterface/performer.interface';
import { performerStore } from '@/store/performer.store';
import restoreConfirm from "@/components/common/funRestoreConfirm"
import { performerServerData } from '@/serverData/performer.serverData';
import { ref, computed, inject } from 'vue'
const updatePerformerAdminMainData = inject<() => void>('updatePerformerAdminMainData');
const store = {
    performerStore: performerStore(),
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