<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('import.titleShowRes', { num: metadata.length })"
        width="800px" :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
        <div class="settingMainDiv" style="overflow-y: scroll; height: 520px;" @scroll="handleScroll">
            <div class="videoInfo" v-for="item, key in dataList" :key="key">
                <div class="imgDiv">
                    <el-image :src="getImageSrc(item)" fit="cover" />
                </div>
                <div class="infoDiv">
                    <div class="block">
                        <span class="title">Title: </span>
                        <p class="content">{{ item.title }}</p>
                    </div>
                    <div class="block"><span class="title">File Path: </span>
                        <p class="content">{{ item.file }}</p>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="buttonGroup">
                <div>
                    <el-button @click="dialogVisible = false">{{ $t('import.cancel') }}</el-button>
                    <el-button type="primary" @click="handleAdd">{{ $t('import.submit')
                    }}</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
    <importResult ref="importResultRef" @importCompleted="dialogVisible = false"></importResult>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import importResult from "./importResult.vue"
import loading from '@/assets/loading'
import { ElMessage } from 'element-plus'
import { ISimpleData } from '@/abilities/importSimple';
import { dataCopyDatabase } from '@/abilities/importSimpleInsertDatabase';
import { ref, nextTick } from 'vue';
import { IfilesBasesSimpleConfig } from "@/dataInterface/filesBasesSetting.interface";
const importResultRef = ref<InstanceType<typeof importResult>>();
const dialogVisible = ref(false);
const dataList = ref<Array<ISimpleData>>([]);
let page = 1;
const limit = 30;
let coverPosterMode = 0;
let metadata: Array<ISimpleData> = [];
let simpleConfig: IfilesBasesSimpleConfig;
const init = () => {
    dataList.value = [];
    page = 1;
}

const setDataList = () => {
    const start = (page - 1) * limit;
    const end = start + limit;
    if (start > metadata.length) {
        return;
    }
    for (let i = 0; i < metadata.length; i++) {
        if (i >= start && i < end) {
            dataList.value.push(metadata[i]);
        }
    }
    page++;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleScroll = (event: any) => {
    const scrollElement = event.target;
    const scrollPosition = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;
    const distanceFromBottom = scrollHeight - scrollPosition - clientHeight;
    if (distanceFromBottom < 100) {
        setDataList();
    }
};



const getImageSrc = (info: ISimpleData) => {
    return info.cover;
}

const handleAdd = async () => {
    loading.open();
    nextTick(async () => {
        try {
            const resultImportData = await dataCopyDatabase(metadata, coverPosterMode, simpleConfig);
            if (resultImportData) {
                importResultRef.value?.open(resultImportData);
            }

        } catch (error: unknown) {
            ElMessage({ message: error as string, type: 'error' })
            console.log(error);
        }
        await loading.closeSync();
    })

}
const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}

const open = (_data: Array<ISimpleData>, _coverPosterMode: number, _config: IfilesBasesSimpleConfig) => {
    init();
    coverPosterMode = _coverPosterMode;
    metadata = _data;
    //metadata = Array(100).fill([]).flatMap(() => _data.slice());
    simpleConfig = _config;
    setDataList();
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({ open });


</script>
<style scoped>
.videoInfo {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    margin-bottom: 10px;
}

.videoInfo .imgDiv {
    width: 100px;
    height: 100px;
}

.videoInfo .infoDiv {
    width: calc(100% - 110px);
    font-size: 12px;

}

.videoInfo .infoDiv .block {
    display: flex;
    padding: 0px;
}

.videoInfo .infoDiv .title {
    width: 100px;
    padding-right: 20PX;
    display: block;
    font-weight: bold;
    text-align: right;
}

.videoInfo .infoDiv .content {
    width: calc(100% - 120PX);
}

.videoInfo .infoDiv .el-tag {
    margin: 0px 5px 5px 0px;
}
</style>