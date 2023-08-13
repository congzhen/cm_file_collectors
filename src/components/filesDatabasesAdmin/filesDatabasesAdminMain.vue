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
        </comTable>
        <filesDatabasesAdminAdd ref="filesDatabasesAdminAddRef"></filesDatabasesAdminAdd>
    </div>
</template>
<script setup lang="ts">
import comTable from '../common/comTable.vue';
import loading from '@/assets/loading'
import filesDatabasesAdminAdd from './filesDatabasesAdminAdd.vue'
import { filesBasesServerData } from "@/serverData/filesBases.serverData"
import { filesBasesStore } from "@/store/filesBases.store"
import { performerBasesStore } from "@/store/performerBases.store"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { IfilesBases, IperformerBases } from '@/dataInterface/databases.interface';
import { ref } from 'vue'
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
    const rd = await filesBasesServerData.status(record.id, false);
    if (rd) {
        store.filesBasesStore.setStatus(record.id, false);
        comTableRef.value?.deleteSuccess();
    } else {
        comTableRef.value?.deleteFail();
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
</style>