<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('m3u8Builder.title')" width="800px"
        :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
        <div class="settingMainDiv">
            <el-table :data="dataList" height="560" border size="small" :show-header="false" style="width: 100%">
                <el-table-column prop="resources_name">
                    <template #default="scope">
                        <div>{{ scope.row.resources_name }}</div>
                        <div class="dsSrc">{{ scope.row.src }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="m3u8BuilderTime" width="180">
                    <template #default="scope">
                        <div>{{ scope.row.refactoringCompleted }}</div>
                        <div v-if="scope.row.endBuilderTime != 0">
                            {{
                                Math.ceil(scope.row.endBuilderTime - scope.row.startBuilderTime) + 's'
                            }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div style="float: right;padding-top:2px;">
                <el-button @click="clBtn">
                    <p v-if="currentBuilderStatus">Stop</p>
                    <p v-else>Builder</p>
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { softWareConfigData } from '@/setup/softwareConfig';
import setupConfig from "@/setup/config"
import { resourcesDramaSeriesServerData } from "@/serverData/resourcesDramaSeries.serverData"
import { ref, nextTick, onMounted } from 'vue'
import { IresDramaSeriesM3u8Builder } from '@/dataInterface/resources.interface';
import virtualRouteConverter from '@/abilities/virtualRouteConverter';
import { existsFile } from '@/assets/file';
import { m3u8 } from '@/webServer/m3u8FFmpeg';
import timer from '@/assets/timer';

enum EbuilderStatus {
    builder = 'builder',
    complete = 'complete',
    fail = 'fail',
    failNoFile = 'file not found',
}

interface IresDramaSeriesM3u8BuilderDataInfo extends IresDramaSeriesM3u8Builder {
    refactoringCompleted: EbuilderStatus;
    startBuilderTime: number;
    endBuilderTime: number;
}

const currentBuilderStatus = ref(false);

const dialogVisible = ref(false)
const dataList = ref<Array<IresDramaSeriesM3u8BuilderDataInfo>>([])

const open = () => {
    dialogVisible.value = true;
}
const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}

const clBtn = () => {
    currentBuilderStatus.value = !currentBuilderStatus.value;
    builderData();
}

const m3u8BuilderStart = async () => {
    await builderData();
}

const builderData = async () => {
    try {
        if (!currentBuilderStatus.value) {
            return;
        }
        const data = await getNeedM3u8BuilderDataList();
        if (data) {
            const dataInfo: IresDramaSeriesM3u8BuilderDataInfo = {
                ...data,
                refactoringCompleted: EbuilderStatus.builder,
                startBuilderTime: Date.now() / 1000,
                endBuilderTime: 0,
            }
            dataList.value.unshift(dataInfo);
            setTimeout(async () => {
                console.log('开始编译', dataInfo);
                const videoFile = virtualRouteConverter(data.src);
                let status = 0;
                if (!existsFile(videoFile)) {
                    dataInfo.refactoringCompleted = EbuilderStatus.failNoFile;
                    status = 0;
                } else {
                    const m3u8Data = await m3u8.getM3u8File(dataInfo.id, videoFile);
                    if (Buffer.isBuffer(m3u8Data)) {
                        dataInfo.refactoringCompleted = EbuilderStatus.complete;
                        status = 1;
                    } else {
                        dataInfo.refactoringCompleted = EbuilderStatus.fail;
                        status = 0;
                    }
                    dataInfo.endBuilderTime = Date.now() / 1000;
                }
                //更新数据中的数据
                await resourcesDramaSeriesServerData.updateM3u8BuilderInfo(dataInfo.id, timer.getTodayFormat(), status);
                setTimeout(async () => {
                    await builderData();
                }, 5000);

            }, 2000);
        } else {
            setTimeout(async () => {
                await builderData();
            }, 10000);
        }
    } catch (e) {
        console.error(e);
    }


}

const getNeedM3u8BuilderDataList = async () => {
    return await resourcesDramaSeriesServerData.getDramaSeriesNeedM3u8BuilderInfo();
}



onMounted(() => {
    if (softWareConfigData.automaticallyCreateVideoM3u8File) {
        currentBuilderStatus.value = true;
        m3u8BuilderStart();
    }
})


// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped>
.settingMainDiv {
    width: 100%;
    height: 600px;
}

.mainDialog .settingMainDiv .dsSrc {
    color: coral;
}
</style>