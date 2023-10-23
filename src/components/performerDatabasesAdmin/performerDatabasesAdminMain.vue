<template>
    <div class="pdacMain">
        <comTable ref="comTableRef" :dataList="store.performerBasesStore.performerBasesList"
            operationsBtnDelete="deactivate" operationsBtnRestore="activate" :sort="true" @editRecordClick="editRecordClick"
            @deleteRecordClick="deleteRecordClick" @restoreRecordClick="restoreRecordClick"
            @sortRecordClick="sortRecordClick">
            <el-table-column prop="name" :label="$t('performerDatabases.name')" width="240" />
            <el-table-column prop="total" :label="$t('performerDatabases.total')" width="90">
                <template #default="scope">
                    {{ store.performerStore.getPerformerCountByPerformerBasesId(scope.row.id) }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('performerDatabases.associatedDatabase')">
                <template #default="scope">
                    <div class="databases-tag-content">
                        <div class="databases-tag" v-for="item, index  in getFilesDatabaseList(scope.row.id)" :key="index">
                            <el-icon>
                                <Coin />
                            </el-icon>
                            <label>{{ item.name }}</label>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('performerDatabases.export')" width="120">
                <template #default="scope">
                    <el-button size="small" icon="Download" @click="exportDatabases(scope.row.id)">{{
                        $t('performerDatabases.export') }}</el-button>
                </template>
            </el-table-column>
            <template v-slot:operations="scope">
                <el-icon class="delete" @click="deletePerformerDatabases(scope.rowData.row)"
                    v-if="!scope.rowData.row.status">
                    <Delete />
                </el-icon>
            </template>
        </comTable>
        <performerDatabasesAdminAdd ref="performerDatabasesAdminAddRef"></performerDatabasesAdminAdd>
    </div>
</template>
<script setup lang="ts">
import setupConfig from '@/setup/config'
import { ElMessage } from 'element-plus'
import comTable from '../common/comTable.vue';
import performerDatabasesAdminAdd from "./performerDatabasesAdminAdd.vue"
import loading from '@/assets/loading'
import deleteConfirm from "@/components/common/funDeleteConfirm"
import { exportPerformer } from '@/assets/performerExportAndImport'
import { ipcRendererSend } from "@/electronCommon"
import { filesBasesStore } from "@/store/filesBases.store"
import { performerBasesStore } from "@/store/performerBases.store"
import { performerStore } from '@/store/performer.store';
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { performerBasesServerData } from "@/serverData/performerBases.serverData"
import { IfilesBases, IperformerBases } from "@/dataInterface/databases.interface"
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteFolderRecursive } from '@/assets/file';
import { performerFaceFolderPath } from '@/assets/fileDbFolder';
const AppInitInject = inject<(_filesBases_id: string) => void>('AppInit');
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    performerStore: performerStore(),
    performerBasesStore: performerBasesStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
}
const comTableRef = ref<InstanceType<typeof comTable>>();
const performerDatabasesAdminAddRef = ref<InstanceType<typeof performerDatabasesAdminAdd>>();

const getFilesDatabaseList = (performerBases_id: string) => {
    const relatedList = store.filesRelatedPerformerBasesStore.getPerformerFilesBasesRelatedList(performerBases_id);
    const arr: Array<IfilesBases> = [];
    relatedList.forEach((relatedItem) => {
        const filesBases = store.filesBasesStore.getFilesBasesById(relatedItem.filesBases_id);
        if (filesBases) {
            arr.push(filesBases);
        }
    });
    return arr;
}

const editRecordClick = (record: IperformerBases) => {
    performerDatabasesAdminAddRef.value?.open('edit', record.id);
}

const deleteRecordClick = async (record: IperformerBases) => {
    loading.open();
    const status1Count = await performerBasesServerData.getStatusCount(1);
    if (status1Count <= 1) {
        ElMessage({
            message: t('performerDatabases.message.leastNeedOnePerformerDatabasesStatus'),
            type: 'warning',
        })
    } else {
        const rd = await performerBasesServerData.status(record.id, false);
        if (rd) {
            store.performerBasesStore.setStatus(record.id, false);
            comTableRef.value?.deleteSuccess();
        } else {
            comTableRef.value?.deleteFail();
        }
    }

    await loading.closeSync();
}

const restoreRecordClick = async (record: IperformerBases) => {
    loading.open();
    const rd = await performerBasesServerData.status(record.id, true);
    if (rd) {
        store.performerBasesStore.setStatus(record.id, true);
        comTableRef.value?.restoreSuccess();
    } else {
        comTableRef.value?.restoreFail();
    }
    await loading.closeSync();

}
const sortRecordClick = async (type: string, _index: number, record: IperformerBases) => {
    loading.open();
    const rd = await performerBasesServerData.sort(record.id, type);
    if (rd) {
        await store.performerBasesStore.init();
    }
    await loading.closeSync();
}


const exportDatabases = async (performerDatabasesId: string) => {
    const savePath = ipcRendererSend.dialogGetFolderPathSync();
    if (savePath != undefined) {
        loading.open();
        setTimeout(async () => {
            exportPerformer(performerDatabasesId, savePath);
            await loading.closeSync();
            ElMessage({
                message: t('performerDatabases.message.exportSuccess'),
                type: 'success',
            })
        }, 500);

    }
}

const deletePerformerDatabases = async (performerDatabases: IperformerBases) => {
    if (await performerBasesServerData.getCount() <= 1) {
        ElMessage({
            message: t('performerDatabases.message.leastNeedOnePerformerDatabases'),
            type: 'error',
        })
        return false;
    }
    deleteConfirm.exec(performerDatabases.name, async () => {
        loading.open();
        const rd = await performerBasesServerData.delete(performerDatabases.id);
        if (!rd.status && rd.num > 0) {
            ElMessage({
                message: t('performerDatabases.message.deleteErrorNoCutAllAssociations'),
                type: 'error',
            })
        } else if (!rd.status && rd.num == 0) {
            ElMessage({
                message: t('performerDatabases.message.deleteFail'),
                type: 'error',
            })
        } else if (rd.status) {
            deleteFolderRecursive(performerFaceFolderPath(performerDatabases.id));
            if (AppInitInject) AppInitInject(store.filesBasesStore.currentFilesBases.id);
        }
        await loading.closeSync();
    });
}

</script>
<style scoped>
.pdacMain {
    width: 100%;
    height: 100%;
}

.databases-tag-content {
    display: flex;
    flex-wrap: wrap;
}

.databases-tag {
    margin: 0px 10px 0px 0px;
    font-size: 12px;
}

.databases-tag .el-icon {
    padding-top: 5px;
}

.databases-tag label {
    padding: 3px 3px 0px 5px
}

.pdacMain .delete {
    cursor: pointer;
    margin: 3px 12px;
    font-size: 16px;
}

.pdacMain .delete:hover {
    color: #5CB6FF;
}
</style>