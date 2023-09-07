<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" width="800px" :close-on-click-modal="false" :show-close="false"
        :fullscreen="fullscreen()" append-to-body>
        <div class="resultCount">
            Success : {{ resultCount.success }} / Already : {{ resultCount.already }} / Fail : {{ resultCount.fail }}
        </div>
        <div class="settingMainDiv" style="overflow-y: scroll; height: 520px;" @scroll="handleScroll">
            <div class="videoInfo" v-for="item, key in dataList" :key="key">
                <div :class="[item.msg, 'info']">
                    <div>
                        <b>[{{ item.data.issueNumber }}] </b> <label> {{ item.data.title }}</label>
                    </div>
                    <div>
                        {{ item.msg }}
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="buttonGroup">
                <div>
                    <el-button type="primary" @click="handleRestart">{{ $t('import.importCompletedConfirmBtn')
                    }}</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import { ipcRendererSend } from "@/electronCommon"
import { InofData } from '@/abilities/importNfo';
import { IimportNfoInsertDatabase } from '@/abilities/importNfoInsertDatabase';
import { ref, reactive, inject } from 'vue';
const AppInitDataInject = inject<() => void>('AppInitData');
const indexUpdateResourcesDataInject = inject<() => void>('indexUpdateResourcesData');

const dialogVisible = ref(false);
const dataList = ref<Array<{
    data: InofData,
    msg: string,
}>>([]);
let page = 1;
const limit = 30;
let metadata: Array<{
    data: InofData,
    msg: string,
}> = [];
const resultCount = reactive({
    already: 0,
    success: 0,
    fail: 0,
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['importCompleted']);

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


const open = (_data: IimportNfoInsertDatabase) => {
    init();
    metadata = _data.data;
    resultCount.already = _data.count.already;
    resultCount.success = _data.count.success;
    resultCount.fail = _data.count.fail;
    setDataList();
    dialogVisible.value = true;
}

const handleRestart = () => {
    //更新数据
    if (AppInitDataInject) AppInitDataInject();
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject();
    dialogVisible.value = false;
    emits("importCompleted");
    //ipcRendererSend.execAppRestart();
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
.resultCount {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: bold;
}

.info {
    font-size: 12px;
    padding: 10px 20px;
}

.Already {
    color: #E6A23C;
}

.Success {
    color: #67C23A;
}

.Fail {
    color: #F56C6C;
}
</style>