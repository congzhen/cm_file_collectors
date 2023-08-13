<template>
    <div class="dramaSeries">
        <div v-if="store.filesBasesSettingStore.config.detailsDramaSeriesMode == 'digit'">
            <el-tag type="info" v-for="item, index in props.dataList.filter(item => item.type == props.mode)" :key="index"
                @click="playClick(item)">{{ index + 1 }}</el-tag>
        </div>
        <div v-else>
            <div class="ds" v-for="item, index in props.dataList.filter(item => item.type == props.mode)" :key="index"
                @click="playClick(item)">
                <el-button size="small" plain>
                    <i> {{ (index + 1) + '. ' }}</i>
                    <label>{{ getFileName(item.src) }}</label>
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { IresDramaSeries } from '@/dataInterface/resources.interface';
import { getFileName } from "@/assets/file"
// eslint-disable-next-line no-undef
const props = defineProps({
    dataList: {
        type: Array as () => Array<IresDramaSeries>,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    }
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['palyDramaSeries']);

const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
}

const playClick = (dramaSeriesInfo: IresDramaSeries) => {
    emits('palyDramaSeries', dramaSeriesInfo);
}


</script>
<style scoped>
.dramaSeries {
    width: 100%;
}

.dramaSeries .el-tag {
    width: 15%;
    text-align: center;
    margin: 2px;
    cursor: pointer;
}

.dramaSeries .ds {
    font-size: 12px;
    width: 99%;
    cursor: pointer;
    margin-top: 2px;
}

.dramaSeries .ds .el-button {
    width: 100%;
    height: auto;
    text-align: left;
    display: block;
}

.dramaSeries .ds .el-button>>>span {
    width: 100%;
    display: block;
    line-height: 13px;
    white-space: pre-wrap;
    display: flex;
}

.dramaSeries .ds .el-button>>>span i {
    width: 20px;
    display: block;
    font-weight: bold;
    text-align: right;
}

.dramaSeries .ds .el-button>>>span label {
    width: calc(100% - 20px);
    display: block;
    cursor: pointer;
}
</style>