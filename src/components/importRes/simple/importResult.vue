<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" width="800px" :close-on-click-modal="false" :show-close="false"
        append-to-body>
        <div class="resultCount">
            Success : {{ resultCount.success }} / Already : {{ resultCount.already }} / Fail : {{ resultCount.fail }}
        </div>
        <div class="settingMainDiv" style="overflow-y: scroll; height: 500px;" @scroll="handleScroll">
            <div class="videoInfo" v-for="item, key in dataList" :key="key">
                <div :class="[item.msg, 'info']">
                    <div>
                        <label> {{ item.data.title }}</label>
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
import { ipcRendererSend } from "@/electronCommon"
import { ref, reactive } from 'vue';
import { IimportSimpleInsertDatabase } from "@/abilities/importSimpleInsertDatabase";
import { ISimpleData } from "@/abilities/importSimple";

const dialogVisible = ref(false);
const dataList = ref<Array<{
    data: ISimpleData,
    msg: string,
}>>([]);
let page = 1;
const limit = 30;
let metadata: Array<{
    data: ISimpleData,
    msg: string,
}> = [];
const resultCount = reactive({
    already: 0,
    success: 0,
    fail: 0,
});

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


const open = (_data: IimportSimpleInsertDatabase) => {
    init();
    metadata = _data.data;
    resultCount.already = _data.count.already;
    resultCount.success = _data.count.success;
    resultCount.fail = _data.count.fail;
    setDataList();
    dialogVisible.value = true;
}

const handleRestart = () => {
    ipcRendererSend.execAppRestart();
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