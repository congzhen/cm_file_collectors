<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('dramaSeriesPathReplacer.title')" width="800px"
        :close-on-click-modal="false" append-to-body>
        <div class="dspr">
            <div class="dsprFrom">
                <div class="inputDiv">
                    <label>{{ $t('dramaSeriesPathReplacer.optDataBases') }}:</label>
                    <el-select v-model="optFilebases" multiple :placeholder="$t('dramaSeriesPathReplacer.allDataBases')">
                        <el-option v-for="item, key in store.filesBasesStore.filesBasesList" :key="key" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </div>
                <div class="inputDiv">
                    <label>{{ $t('dramaSeriesPathReplacer.searchPath') }}:</label>
                    <el-input v-model="searchText" size="small" @input="inputSearch">
                        <template #append>
                            <el-button icon="Search" @click="clickSearch">{{ $t('dramaSeriesPathReplacer.search')
                            }}</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="inputDiv">
                    <label>{{ $t('dramaSeriesPathReplacer.replacePath') }}:</label>
                    <el-input v-model="replaceText" size="small">
                        <template #append>
                            <el-button icon="Refresh" @click="clickReplace">{{ $t('dramaSeriesPathReplacer.replace')
                            }}</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="inputDiv">
                    <label></label>
                    <div class="resultCount" v-if="dataList.length > 0">
                        {{ $t('dramaSeriesPathReplacer.resultMessage.searchSuccess', { count: dataList.length }) }}
                    </div>
                </div>
            </div>
            <div class="dsprResult">
                <el-scrollbar height="100%">
                    <div class="dataInfo" v-for="item, key in dataList" :key="key">
                        <div class="title"><label v-if="item.issueNumber != ''">[{{ item.issueNumber }}]</label> {{
                            item.title }}</div>
                        <div class="dataDramaSeries" v-html="searchContentShowRed(item.src)"> </div>
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
import { resourcesDramaSeriesServerData } from '@/serverData/resourcesDramaSeries.serverData'
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n'
import { IresDramaSeriesParhReplaceerInfo } from '@/dataInterface/resources.interface';
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
}

const dialogVisible = ref(false);
const optFilebases = ref([]);
const searchText = ref('');
const replaceText = ref('');
const dataList = ref<Array<IresDramaSeriesParhReplaceerInfo>>([]);

const debounceClass = new Debounce();

const inputSearch = () => {
    debounceClass.debounceNow(() => {
        if (dataList.value.length > 0) {
            dataList.value = [];
        }
    })
}

const clickSearch = () => {
    if (searchText.value == '') {
        ElMessage({
            message: t('dramaSeriesPathReplacer.resultMessage.pleaseEnterSearchCriteria'),
            type: 'warning',
        })
    } else {
        getDataList();
    }
}

const clickReplace = () => {
    if (searchText.value == '') {
        ElMessage({
            message: t('dramaSeriesPathReplacer.resultMessage.pleaseEnterSearchCriteria'),
            type: 'warning',
        })
    } else if (dataList.value.length == 0) {
        ElMessage({
            message: t('dramaSeriesPathReplacer.resultMessage.pleaseFilterTheDataToBeReplacedFirst'),
            type: 'error',
        })
    } else if (replaceText.value == '') {
        ElMessage({
            message: t('dramaSeriesPathReplacer.resultMessage.pleaseEnterReplaceContent'),
            type: 'error',
        })
    } else {
        execReplace(searchText.value, replaceText.value, dataList.value.map(item => item.id));
    }
}

const execReplace = async (_search: string, _replace: string, _idList: Array<string>) => {
    loading.open();
    await resourcesDramaSeriesServerData.replaceSrc(_search, _replace, _idList);
    nextTick(async () => {
        await loading.closeSync();
    })
}

const getDataList = async () => {
    loading.open();
    dataList.value = await resourcesDramaSeriesServerData.getDataListByLikeSrc(searchText.value, optFilebases.value);
    nextTick(async () => {
        await loading.closeSync();
    })
}

const searchContentShowRed = (contentText: string) => {
    return contentText.replace(new RegExp(searchText.value, "gi"), `<span style="color: red">${searchText.value}</span>`);
}


const open = () => {
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