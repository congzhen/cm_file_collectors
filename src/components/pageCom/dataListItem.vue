<template>
    <div class="videoItem" @click="clickHandle(EresDetatilsType.show)" :style="{ width: getWidth(), height: getHeight() }">
        <div class="topFloatBar" :style="{ width: getWidth() }">
            <div class="tag" v-if="props.dataInfo.definition != ''"
                :style="{ backgroundColor: store.filesBasesSettingStore.config.definitionRgba, color: store.filesBasesSettingStore.config.definitionFontColor }">
                {{ $t('definition.' + props.dataInfo.definition) }}
            </div>
            <div class="tag" v-for="tagInfo, key in showTag" :key="key" :style="{
                backgroundColor: getTagRgba(tagInfo),
                color: getTagColor(tagInfo),
                border: '1px solid ' + getTagRgba(tagInfo),
                borderRadius: '5px',
            }">
                {{ tagInfo.name }}</div>
        </div>

        <el-image :src="getCoverSrc()" :fit="getFit()">
            <template #error>
                <el-empty description=" " :image-size="100" />
            </template>
        </el-image>
        <div class="videoNameGB"></div>
        <div class="videoName">{{ props.dataInfo.title }}</div>
        <div v-if="!store.baseStore.batchEditStatus" class="videoPlayBtn" @click.stop="clickHandle(EresDetatilsType.play)">
            <el-icon>
                <VideoPlay />
            </el-icon>
        </div>
        <div v-else class="videoMultipleChoice" @click.stop="clickMultipleChoice()">
            <div class="checkmark" v-if="checkmarkStatus()">
                <el-icon color="#FFFFFF"><Select /></el-icon>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import randomPoster from "@/abilities/randomPoster"
import { resCoverImageSrc } from "@/assets/fileDbFolder"
import { EresDetatilsType } from "@/dataInterface/common.enum"
import { IresourcesBase } from '@/dataInterface/resources.interface';
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import { tagStore } from "@/store/tag.store";
import { baseStore } from "@/store/base.store"
import { resourcesTagsServerData } from "@/serverData/resourcesTags.serverData"
import { onMounted, nextTick, ref, watch } from 'vue'
import { Itag } from "@/dataInterface/tag.interface";
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
    baseStore: baseStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
    tagStore: tagStore(),
}

watch(
    () => props.dataInfo,
    () => getTag()
)

const showTag = ref<Array<Itag>>([]);

const clickHandle = (type: EresDetatilsType) => {
    emits('clickHandle', type, props.dataInfo);
}

const clickMultipleChoice = () => {
    if (store.baseStore.checkBatchEditDataStatus(props.dataInfo)) {
        store.baseStore.deleteBatchEditData(props.dataInfo)
    } else {
        store.baseStore.addBatchEditData(props.dataInfo)
    }
}

const checkmarkStatus = () => {
    return store.baseStore.checkBatchEditDataStatus(props.dataInfo);
}

const getCoverSrc = () => {
    if (props.dataInfo.coverPoster != '') {
        return resCoverImageSrc(props.dataInfo.filesBases_id, props.dataInfo.coverPoster);
    } else {
        return randomPoster(props.dataInfo.addTime);
    }
}

const useRandomPosters = () => {
    if (props.dataInfo.coverPoster == '' && store.filesBasesSettingStore.config.randomPosterStatus && store.filesBasesSettingStore.config.randomPosterPath != '') {
        return true;
    }
    return false;
}


const getFit = () => {
    if (store.filesBasesSettingStore.config.coverPosterWidthStatus || useRandomPosters()) {
        return 'cover';
    } else {
        return '';
    }
}

const getWidth = () => {
    if (useRandomPosters() && !store.filesBasesSettingStore.config.randomPosterAutoSize) {
        return store.filesBasesSettingStore.config.randomPosterWidth + 'px';
    }
    if (store.filesBasesSettingStore.config.coverPosterWidthStatus) {
        return store.filesBasesSettingStore.config.coverPosterWidthBase + 'px';
    } else if (store.filesBasesSettingStore.config.coverPosterHeightStatus) {
        return store.filesBasesSettingStore.config.coverPosterHeightBase / props.dataInfo.coverPosterHeight * props.dataInfo.coverPosterWidth + 'px';
    }
    return props.dataInfo.coverPosterWidth + 'px';
}

const getHeight = () => {
    if (useRandomPosters() && !store.filesBasesSettingStore.config.randomPosterAutoSize) {
        return store.filesBasesSettingStore.config.randomPosterHeight + 'px';
    }
    if (store.filesBasesSettingStore.config.coverPosterHeightStatus) {
        return store.filesBasesSettingStore.config.coverPosterHeightBase + 'px';
    }
    return props.dataInfo.coverPosterHeight + 'px';
}

const getTag = () => {
    if (store.filesBasesSettingStore.config.coverDisplayTag.length > 0) {
        resourcesTagsServerData.getDataListByResources_id(props.dataInfo.id).then((res) => {
            const arr: Array<Itag> = [];
            for (const tag of res) {
                if (store.filesBasesSettingStore.config.coverDisplayTag.includes(tag.tag_id)) {
                    const tagInfo = store.tagStore.getTagById(tag.tag_id);
                    if (tagInfo && tagInfo.status) {
                        arr.push(tagInfo);
                    }
                }
            }
            showTag.value = arr;
        });
    } else {
        showTag.value = [];
    }
}

const getTagRgba = (tagInfo: Itag) => {
    const index = store.filesBasesSettingStore.config.coverDisplayTag.indexOf(tagInfo.id);
    return store.filesBasesSettingStore.config.coverDisplayTagRgbas[index % store.filesBasesSettingStore.config.coverDisplayTagRgbas.length];
}

const getTagColor = (tagInfo: Itag) => {
    const index = store.filesBasesSettingStore.config.coverDisplayTag.indexOf(tagInfo.id);
    return store.filesBasesSettingStore.config.coverDisplayTagColors[index % store.filesBasesSettingStore.config.coverDisplayTagColors.length];
}

onMounted(() => {
    nextTick(() => {
        getTag()
    })

})

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

.videoItem .topFloatBar {
    padding: 1px;
    font-size: 12px;
    line-height: 16px;
    position: absolute;
    margin-left: 3px;
    margin-top: 3px;
    z-index: 10;
}

.videoItem .topFloatBar .tag {
    width: auto;
    padding: 1px 7px;
    line-height: 16px;
    height: 16px;
    text-align: center;
    border-radius: 3px;
    display: inline-block;
    margin: 0px 2px 2px 0px;
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


.videoItem .videoMultipleChoice {
    position: absolute;
    z-index: 10;
    margin-left: 2px;
    margin-top: -60px;
    width: 20px;
    height: 20px;
    border: 1px solid #c7cad1;
    background-color: #F2F2F5;
    border-radius: 5px;
}

/* 定义对号的样式 */
.videoItem .videoMultipleChoice .checkmark {
    width: 20px;
    height: 20px;
    background-color: #409EFF;
    border-radius: 50%;
}

.videoItem .videoMultipleChoice .checkmark .el-icon {
    padding: 2px 0px 0px 2px;
}
</style>