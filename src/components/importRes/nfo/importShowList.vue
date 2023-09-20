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
                    <div class="block">
                        <span class="title">IssueNumber: </span>
                        <p class="content">{{ item.issueNumber }}</p>
                    </div>
                    <div class="block"><span class="title">Abstract: </span>
                        <p class="content">{{ item.abstract }}</p>
                    </div>
                    <div class="block"><span class="title">Year: </span>
                        <p class="content">{{ item.year }}</p>
                    </div>
                    <div class="block"><span class="title">Tag: </span>
                        <p class="content">{{ item.tag }}</p>
                    </div>
                    <div class="block">
                        <span class="title">performer: </span>
                        <p class="content">
                            <el-tag v-for="per, pkey in item.performer" :key="pkey">{{ per.name }}</el-tag>
                        </p>
                    </div>
                    <div class="block">
                        <span class="title">File Path: </span>
                        <div class="content">
                            <div>{{ item.videoPath }}</div>
                            <div v-for="series, seriesKey in item.series" :key="seriesKey">{{ series }}</div>
                        </div>
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
import { InofData } from '@/abilities/importNfo';
import { dataCopyDatabase } from '@/abilities/importNfoInsertDatabase';
import { existsFile } from '@/assets/file';
import { ref, nextTick } from 'vue';
const importResultRef = ref<InstanceType<typeof importResult>>();
const dialogVisible = ref(false);
const dataList = ref<Array<InofData>>([]);
let page = 1;
const limit = 30;
let coverPosterMode = 0;
let metadata: Array<InofData> = [];


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



const getImageSrc = (info: InofData) => {
    const src = info.folder + '\\' + info.cover;
    if (existsFile(src)) {
        return src;
    } else {
        return info.cover;
    }
}

const handleAdd = async () => {
    loading.open();
    nextTick(async () => {
        try {
            const resultImportData = await dataCopyDatabase(metadata, coverPosterMode);
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

const open = (_data: Array<InofData>, _coverPosterMode: number) => {
    init();
    page = 1;
    coverPosterMode = _coverPosterMode;
    metadata = _data;
    //metadata = Array(100).fill([]).flatMap(() => _data.slice());

    setDataList();
    dialogVisible.value = true;
}


const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}


// eslint-disable-next-line no-undef
defineExpose({ open });


</script>
<style scoped>
.videoInfo {
    min-height: 150px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    margin-bottom: 30px;
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