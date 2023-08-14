<template>
    <div class="videoItem" @click="clickHandle(EresDetatilsType.show)" :style="{ width: getWidth(), height: getHeight() }">
        <div class="videoDefinitionTap" v-if="props.dataInfo.definition != ''">
            {{ $t('definition.' + props.dataInfo.definition) }}
        </div>
        <el-image
            :src="props.dataInfo.coverPoster != '' ? (setupConfig.resCoverPosterPath + props.dataInfo.filesBases_id + '/' + props.dataInfo.coverPoster) : ''">
            <template #error>
                <el-empty description=" " :image-size="100" />
            </template>
        </el-image>
        <div class="videoNameGB"></div>
        <div class="videoName">{{ props.dataInfo.title }}</div>
        <div class="videoPlayBtn" @click.stop="clickHandle(EresDetatilsType.play)">
            <el-icon>
                <VideoPlay />
            </el-icon>
        </div>
    </div>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import { EresDetatilsType } from "@/dataInterface/common.enum"
import { IresourcesBase } from '@/dataInterface/resources.interface';
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";

// eslint-disable-next-line no-undef
const props = defineProps({
    dataInfo: {
        type: Object as () => IresourcesBase,
        required: true,
    }
})
// eslint-disable-next-line no-undef
const emits = defineEmits(['clickHandle']);

const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
}

const clickHandle = (type: EresDetatilsType) => {
    emits('clickHandle', type, props.dataInfo);
}

const getWidth = () => {
    if (store.filesBasesSettingStore.config.coverPosterHeightStatus) {
        return store.filesBasesSettingStore.config.coverPosterHeightBase / props.dataInfo.coverPosterHeight * props.dataInfo.coverPosterWidth + 'px';
    }
    return props.dataInfo.coverPosterWidth + 'px';
}

const getHeight = () => {
    if (store.filesBasesSettingStore.config.coverPosterHeightStatus) {
        return store.filesBasesSettingStore.config.coverPosterHeightBase + 'px';
    }
    return props.dataInfo.coverPosterHeight + 'px';
}

</script>
<style scoped>
.videoItem {
    width: 156px;
    height: 218px;
    margin: 0px 5px 5px 0px;
    cursor: pointer;
    user-select: none;
    position: relative;
    overflow: hidden;
}

.videoItem:hover .videoPlayBtn {
    display: block;
}

.videoItem .videoDefinitionTap {
    width: auto;
    padding: 1px 7px;
    font-size: 12px;
    line-height: 16px;
    height: 16px;
    position: absolute;
    margin-left: 3px;
    margin-top: 3px;
    background-color: #9B58B6;
    opacity: 0.5;
    color: #F3F3F3;
    z-index: 10;
    text-align: center;
    border-radius: 3px;
}

.videoItem .el-image {
    width: 100%;
    height: 100%;
}

.videoItem .videoNameGB {
    position: absolute;
    width: 100%;
    height: 24px;
    z-index: 5;
    margin-top: -28px;
    background-color: #282923;
    opacity: 0.5;
}

.videoItem .videoName {
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    margin-top: -28px;
    color: #FFFFFF;
    position: absolute;
    z-index: 6;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.videoItem .videoPlayBtn {
    position: absolute;
    z-index: 10;
    margin-left: 2px;
    margin-top: -60px;
    font-size: 50px;
    color: #F3F3F3;
    opacity: 0.9;
    display: none;
}
</style>