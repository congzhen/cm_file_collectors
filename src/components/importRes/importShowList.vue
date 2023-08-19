<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('import.titleShowRes', { num: metadata.length })"
        width="800px" :close-on-click-modal="false" append-to-body>
        <div class="settingMainDiv" style="overflow-y: scroll; height: 600px;" @scroll="handleScroll">
            <div class="videoInfo" v-for="item, key in dataList" :key="key">
                <div class="imgDiv">
                    <el-image :src="getImageSrc(item)" fit="cover" />
                </div>
                <div class="infoDiv">
                    <div>{{ item.title }}</div>
                    <div>{{ item.issueNumber }}</div>
                    <div>{{ item.abstract }}</div>
                    <div>{{ item.year }}</div>
                    <div>{{ item.tag }}</div>
                    <div>
                        <el-tag v-for="per, pkey in item.performer" :key="pkey">{{ per.name }}</el-tag>
                    </div>
                    <div>{{ item.videoPath }}</div>
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
    <importResult ref="importResultRef"></importResult>
</template>
<script setup lang="ts">
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
    coverPosterMode = _coverPosterMode;
    metadata = _data;
    //metadata = Array(100).fill([]).flatMap(() => _data.slice());

    setDataList();
    dialogVisible.value = true;
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
    margin-bottom: 20px;
}

.videoInfo .imgDiv {
    width: 100px;
    height: 100px;
}

.videoInfo .infoDiv {
    width: calc(100% - 110px);
    font-size: 12px;
}

.videoInfo .infoDiv .el-tag {
    margin: 0px 5px 5px 0px;
}
</style>