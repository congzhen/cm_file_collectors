<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('batchDeletionTool.title')" width="800px"
        :close-on-click-modal="false" append-to-body>
        <div class="dspr">
            <div class="dsprFrom">
                <div class="inputDiv">
                    <label>{{ $t('batchDeletionTool.optDataBases') }}:</label>
                    <el-select v-model="optFilebases" multiple :placeholder="$t('batchDeletionTool.allDataBases')">
                        <el-option v-for="item, key in store.filesBasesStore.filesBasesList" :key="key" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </div>
                <div class="inputDiv">
                    <label>{{ $t('batchDeletionTool.dramaSeriesPath') }}:</label>
                    <el-input v-model="dramaSeriesPath" size="small" @input="changeChange"> </el-input>
                </div>
                <div class="inputDiv">
                    <label>{{ $t('batchDeletionTool.addTime') }}:</label>
                    <div class="inputDivBlock">
                        <el-date-picker v-model="datetimerange" type="datetimerange" range-separator="-"
                            :start-placeholder="$t('batchDeletionTool.startDate')"
                            :end-placeholder="$t('batchDeletionTool.endDate')" value-format="YYYY-MM-DD HH:mm:ss"
                            @change="changeChange" />
                    </div>

                </div>
                <div class="inputDiv">
                    <label></label>
                    <el-button @click="clickSearch">{{ $t('batchDeletionTool.search') }}</el-button>
                    <el-button v-if="dataList.length > 0" @click="clickDelete" type="danger">{{
                        $t('batchDeletionTool.delete')
                    }}</el-button>
                </div>
                <div class="inputDiv">
                    <label></label>
                    <div class="resultCount" v-if="dataList.length > 0">
                        {{ $t('batchDeletionTool.resultMessage.searchSuccess', { count: dataList.length }) }}
                    </div>
                </div>

            </div>
            <div class="dsprResult">
                <el-scrollbar height="100%">
                    <div class="dataInfo" v-for="item, key in dataList" :key="key">
                        <div class="title"><label v-if="item.issueNumber != ''">[{{ item.issueNumber }}]</label> {{
                            item.title }}</div>
                        <div class="title" v-if="item.addTime != ''">{{ item.addTime }}</div>
                        <div class="title" v-if="item.filesBases_id != ''">{{
                            store.filesBasesStore.getFilesBasesById(item.filesBases_id)?.name }}</div>
                        <div class="dataDramaSeries" v-for="series, skey in item.dramaSeries" :key="skey"
                            v-html="searchContentShowRed(series.src)"> </div>
                    </div>

                </el-scrollbar>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import loading from '@/assets/loading'
import { Debounce } from '@/assets/tool'
import { filesBasesStore } from "@/store/filesBases.store"
import { ref, nextTick, inject } from 'vue';
import { useI18n } from 'vue-i18n'
import { IresSimpleAnddramaSeries } from '@/dataInterface/resources.interface';
import { resourcesServerData } from '@/serverData/resources.serverData'
import deleteConfirm from '../common/funDeleteConfirm';
import { deleteFile } from '@/assets/file';
import { resCoverFolderPath } from '@/assets/fileDbFolder'
const { t } = useI18n();
const indexUpdateResourcesDataInject = inject<() => void>('indexUpdateResourcesData');
const store = {
    filesBasesStore: filesBasesStore(),
}

const dialogVisible = ref(false);
const optFilebases = ref([]);
const dramaSeriesPath = ref('');
const datetimerange = ref(null)
const dataList = ref<Array<IresSimpleAnddramaSeries>>([]);


const init = () => {
    optFilebases.value = [];
    dramaSeriesPath.value = '';
    datetimerange.value = null;
    dataList.value = [];
}

const debounceClass = new Debounce();
const changeChange = () => {
    debounceClass.debounceNow(() => {
        if (dataList.value.length > 0) {
            dataList.value = [];
        }
    })
}



const clickSearch = async () => {
    await getDataList();
}

const clickDelete = async () => {
    if (dataList.value.length > 0) {
        deleteConfirm.exec(t('batchDeletionTool.resultMessage.deletePrompt', { count: dataList.value.length }), async () => {
            loading.open();
            nextTick(async () => {
                try {
                    for (const resDataInfo of dataList.value) {
                        await resourcesServerData.delete(resDataInfo.id);
                        if (resDataInfo.coverPoster != '') {
                            deleteFile(resCoverFolderPath(resDataInfo.filesBases_id), resDataInfo.coverPoster);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                await loading.closeSync();
                ElMessage({ message: t('batchDeletionTool.resultMessage.deleteComplete'), type: 'success' });
                if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject();
            })
        });
    }
}

const getDataList = async () => {
    loading.open();
    dataList.value = await resourcesServerData.getDataListAddTimeAndSeries(dramaSeriesPath.value, optFilebases.value, datetimerange.value);
    nextTick(async () => {
        await loading.closeSync();
    })
}

const searchContentShowRed = (contentText: string) => {
    return contentText.replace(new RegExp(dramaSeriesPath.value, "gi"), `<span style="color: red">${dramaSeriesPath.value}</span>`);
}



const open = () => {
    init();
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped>
.inputDiv {
    display: flex;
    font-size: 12px;
    line-height: 28px;
    padding-bottom: 5px;
}

.inputDiv label {
    width: 100px;
    text-align: right;
    padding: 0 20px;
}

.inputDiv .el-input {
    width: 500px;
}

.inputDiv .el-select {
    width: 500px;
}

.inputDiv .inputDivBlock {
    width: 500px;
}

.resultCount {
    color: #E6A23C;
}

.dsprResult {
    width: 100%;
    height: 350px;
}

.dataInfo {
    font-size: 12px;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    background-color: #E9E9EB;
}

.dataInfo .title {
    font-weight: bold;
}

.dataDramaSeries {
    padding: 2px 0px;
    color: #409EFF;
}
</style>