<template>
    <div class="daMain">
        <comTable ref="comTableRef" :dataList="store.filesBasesStore.filesBasesList" operationsBtnDelete="deactivate"
            operationsBtnRestore="activate" :sort="true" @editRecordClick="editRecordClick"
            @deleteRecordClick="deleteRecordClick" @restoreRecordClick="restoreRecordClick"
            @sortRecordClick="sortRecordClick">
            <el-table-column prop="name" :label="$t('filesDatabases.name')" width="300" :show-overflow-tooltip="true" />
            <el-table-column prop="mainPerformerDatabase" :label="$t('filesDatabases.mainPerformerDatabase')" width="240"
                :show-overflow-tooltip="true">
                <template #default="scope">
                    <div class="databases-tag">
                        <el-icon>
                            <Coin />
                        </el-icon>
                        <label>{{ getMainPerformerDatabase(scope.row.id) }}</label>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="mainPerformerDatabase" :label="$t('filesDatabases.relatedPerformerDatabase')">
                <template #default="scope">
                    <div class="databases-tag-content">
                        <div class="databases-tag" v-for="item, index  in getPerformerDatabaseList(scope.row.id)"
                            :key="index">
                            <el-icon>
                                <Coin />
                            </el-icon>
                            <label>{{ item.name }}</label>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <template v-slot:operations="scope">
                <el-icon class="delete" @click="deleteFilesDatabases(scope.rowData.row)" v-if="!scope.rowData.row.status">
                    <Delete />
                </el-icon>
            </template>
        </comTable>
        <filesDatabasesAdminAdd ref="filesDatabasesAdminAddRef"></filesDatabasesAdminAdd>
    </div>
</template>
<script setup lang="ts">
import comTable from '../common/comTable.vue';
import loading from '@/assets/loading'
import { ElMessage } from 'element-plus'
import setupConfig from "@/setup/config";
import deleteConfirm from "@/components/common/funDeleteConfirm"
import filesDatabasesAdminAdd from './filesDatabasesAdminAdd.vue'
import { filesBasesServerData } from "@/serverData/filesBases.serverData"
import { filesBasesStore } from "@/store/filesBases.store"
import { performerBasesStore } from "@/store/performerBases.store"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { IfilesBases, IperformerBases } from '@/dataInterface/databases.interface';
import { ref, inject } from 'vue'
import { deleteFolderRecursive } from '@/assets/file';
import { useI18n } from 'vue-i18n'
import { EresUpdate } from '@/dataInterface/common.enum';
import { resCoverFolderPath } from '@/assets/fileDbFolder';
const AppInitInject = inject<(_filesBases_id: string, _callBack: () => void) => void>('AppInit');
const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    performerBasesStore: performerBasesStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
}
const comTableRef = ref<InstanceType<typeof comTable>>();
const filesDatabasesAdminAddRef = ref<InstanceType<typeof filesDatabasesAdminAdd>>();

const getMainPerformerDatabase = (filesBases_id: string) => {
    const mainPerformerBasesId = store.filesRelatedPerformerBasesStore.getFilesMainPerformerBasesId(filesBases_id);
    if (mainPerformerBasesId) {
        return store.performerBasesStore.getPerformerBasesById(mainPerformerBasesId)?.name;
    }
    return undefined;
}

const getPerformerDatabaseList = (filesBases_id: string) => {
    const relatedList = store.filesRelatedPerformerBasesStore.getFilesPerformerBasesRelatedList(filesBases_id);
    const arr: Array<IperformerBases> = [];
    relatedList.forEach((relatedItem) => {
        const performerBases = store.performerBasesStore.getPerformerBasesById(relatedItem.performerBases_id);
        if (performerBases) {
            arr.push(performerBases);
        }
    });
    return arr;
}

const editRecordClick = (record: IfilesBases) => {
    filesDatabasesAdminAddRef.value?.open('edit', record.id);
}

const deleteRecordClick = async (record: IfilesBases) => {
    loading.open();
    const status1Count = await filesBasesServerData.getStatusCount(1);
    if (status1Count <= 1) {
        ElMessage({
            message: t('filesDatabases.message.leastNeedOneFilesDatabasesStatus'),
            type: 'warning',
        })
    } else {
        const rd = await filesBasesServerData.status(record.id, false);
        if (rd) {
            store.filesBasesStore.setStatus(record.id, false);
            comTableRef.value?.deleteSuccess();
        } else {
            comTableRef.value?.deleteFail();
        }
    }

    await loading.closeSync();
}

const restoreRecordClick = async (record: IfilesBases) => {
    loading.open();
    const rd = await filesBasesServerData.status(record.id, true);
    if (rd) {
        store.filesBasesStore.setStatus(record.id, true);
        comTableRef.value?.restoreSuccess();
    } else {
        comTableRef.value?.restoreFail();
    }
    await loading.closeSync();

}
const sortRecordClick = async (type: string, _index: number, record: IfilesBases) => {
    loading.open();
    const rd = await filesBasesServerData.sort(record.id, type);
    if (rd) {
        await store.filesBasesStore.init();
    }
    await loading.closeSync();
}

const deleteFilesDatabases = async (filesBases: IfilesBases) => {
    if (await filesBasesServerData.getCount() <= 1) {
        ElMessage({
            message: t('filesDatabases.message.leastNeedOneFilesDatabases'),
            type: 'error',
        })
        return false;
    }
    deleteConfirm.exec(filesBases.name, async () => {
        loading.open();
        const rd = await filesBasesServerData.delete(filesBases.id);
        if (rd) {
            deleteFolderRecursive(resCoverFolderPath(filesBases.id));
            let showFilesBasesId = store.filesBasesStore.currentFilesBases.id == filesBases.id ? store.filesBasesStore.filesBasesList[0].id : store.filesBasesStore.currentFilesBases.id;
            if (showFilesBasesId == filesBases.id && store.filesBasesStore.filesBasesList[1]) {
                showFilesBasesId = store.filesBasesStore.filesBasesList[1].id;
            }
            if (AppInitInject) AppInitInject(showFilesBasesId, async () => {
                if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData, EresUpdate.updataDetailsViewByUpdateDataFirstRecord]);
            });
        } else {
            ElMessage({
                message: t('filesDatabases.message.deleteFail'),
                type: 'error',
            })
        }
        await loading.closeSync();
    });
}


</script>
<style scoped>
.daMain {
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

.daMain .delete {
    cursor: pointer;
    margin: 3px 12px;
    font-size: 16px;
}

.daMain .delete:hover {
    color: #5CB6FF;
}
</style>