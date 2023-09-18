<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="dialogTitle" width="90%" top="4vh"
        :fullscreen="fullscreen()" :append-to-body="true" :close-on-click-modal="false">
        <div class="mainBody" :style="{ height: getHeihgt(), 'overflow-y': 'auto' }" @scroll="scrollBottom">
            <div ref="listRef" class="list" v-if="store.filesBasesSettingStore.config.playAtlasMode == 'flex'">
                <div class="item" v-for="fileImageInfo, key in filesList" :key="key" :title="fileImageInfo.name"
                    :style="{ width: store.filesBasesSettingStore.config.playAtlasImageWidth + 'px', height: getImageHeight(fileImageInfo) + 'px' }">
                    <div class="photo">
                        <el-image :src="fileImageInfo.src" fit="cover" loading="lazy" :preview-src-list="filesList_C"
                            :initial-index="key" />
                    </div>
                    <div class="title">{{ fileImageInfo.name }}</div>
                </div>
            </div>
            <!--<div ref="listRef" class="list" :style="getWaterfallStyle()">-->
            <div v-else class="masonry-container list" :key="masonryKey" v-masonry transition-duration="0.3s"
                item-selector=".item">
                <div class="item" v-for="fileImageInfo, key in filesList" :key="key" :title="fileImageInfo.name"
                    :style="{ width: store.filesBasesSettingStore.config.playAtlasImageWidth + 'px', height: getImageHeight(fileImageInfo) + 'px' }">
                    <div class="photo">
                        <el-image :src="fileImageInfo.src" fit="cover" loading="lazy" :preview-src-list="filesList_C"
                            :initial-index="key" />
                    </div>
                    <div class="title">{{ fileImageInfo.name }}</div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="slider-block">
                <span class="demonstration">{{ $t('settings.play.playAtlasImageWidth') }}</span>
                <el-slider v-model="store.filesBasesSettingStore.config.playAtlasImageWidth" :min="150" :max="1000"
                    @change="saveFilesBasesSettingStore" />
                <span class="demonstration">{{ $t('settings.play.playAtlasMode') }}</span>
                <el-select v-model="store.filesBasesSettingStore.config.playAtlasMode" @change="saveFilesBasesSettingStore">
                    <el-option v-for="item in dataset.playAtlasMode" :key="item"
                        :label="$t('settings.play.playAtlasModeData.' + item)" :value="item" />
                </el-select>
                <span class="total">Total : {{ originalDataList.length }}</span>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import dataset from "@/assets/dataset"
import loading from '@/assets/loading'
import { ElMessage } from 'element-plus'
import { Throttle } from "@/assets/tool"
import { EfileImageInfo, existsFile, readDir, readfileImageInfo } from "@/assets/file"
import { filesBasesStore } from "@/store/filesBases.store"
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { computed } from "vue";
import { ref, watch } from "vue"

const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}

let originalDataList: Array<string> = [];
const page = ref(1);
let limit = 100;

const listRef = ref<HTMLDivElement>();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const folder = ref('');


const filesList = ref<Array<EfileImageInfo>>([]);
const masonryKey = ref(0);

const ThrottleClass = new Throttle();
watch(
    () => store.filesBasesSettingStore.config.playAtlasImageWidth,
    () => {
        ThrottleClass.throttleTimeout(() => {
            masonryKey.value = masonryKey.value + 1;
        }, 500);
    }
);

const init = () => {
    originalDataList = [];
    page.value = 1;
    limit = store.filesBasesSettingStore.config.playAtlasPageLimit;
    filesList.value = [];
}

const setFilesList = async () => {
    if (isLastPage()) {
        return;
    }
    loading.open();
    const star = (page.value - 1) * limit;
    const end = star + limit;
    let i = 0;
    const temFilseArr: Array<EfileImageInfo> = [];
    for (const imageName of originalDataList) {
        if (i >= star && i < end) {
            try {
                const imageInfo = await readfileImageInfo(folder.value, imageName);
                temFilseArr.push(imageInfo);
            } catch (e) {
                temFilseArr.push({
                    src: "",
                    name: "",
                    format: "",
                    density: 0,
                    width: 100,
                    height: 100,
                });
                console.log(imageName + e as string);
                ElMessage({ message: imageName + e as string, type: 'error' })
            }


        } else if (i >= end) {
            break;
        }
        i++;
    }
    filesList.value = [...filesList.value, ...temFilseArr];
    masonryKey.value = masonryKey.value + 1;
    await loading.closeSync();
}

const isLastPage = () => {
    return filesList.value?.length >= originalDataList.length;
}

const ThrottleClassScroll = new Throttle();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrollBottom = (e: any) => {
    const Scroll = e.target;
    const scrollHeight = Scroll.scrollHeight;
    const clientHeight = Scroll.clientHeight;
    const scrollTop = Scroll.scrollTop;
    let threshold = 150;
    const isBottomReached = scrollHeight - clientHeight - scrollTop < threshold;
    const isLast = isLastPage(); // Assuming isLastPage() is an expensive function
    if (isBottomReached && !isLast) {
        ThrottleClassScroll.throttleTimeout(async () => {
            page.value++;
            await setFilesList();
            Scroll.scrollTo(0, scrollTop);
        }, 1000);

    }
}

const getHeihgt = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return (window.innerHeight - 150) + 'px';
    }
    return (window.innerHeight - 250) + 'px';
}


const getImageHeight = (fileImageInfo: EfileImageInfo) => {
    return (store.filesBasesSettingStore.config.playAtlasImageWidth * fileImageInfo.height / fileImageInfo.width);
}


const filesList_C = computed(() => {
    return filesList.value?.map((fileImageInfo) => {
        return fileImageInfo.src;
    })
})


const saveFilesBasesSettingStore = () => {
    store.filesBasesSettingStore.save(store.filesBasesStore.currentFilesBases.id);
}

const show = async (path: string, title = '') => {
    init();
    if (!existsFile(path)) {
        return undefined;
    }
    loading.open();
    originalDataList = await readDir(path, ['jpg', 'jpeg', 'png', 'gif'])
    //filesList.value = await readDirImage(path);
    folder.value = path;
    dialogTitle.value = title;
    dialogVisible.value = true;
    await loading.closeSync();
    await setFilesList();
    return true;
}


const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}

// eslint-disable-next-line no-undef
defineExpose({ show });

</script>
<style scoped>
.mainBody {
    background-color: #EFEFEF;
    border-radius: 2px;
    padding: 5px 0px;
}

.list {
    width: 100%;
    flex-wrap: wrap;
}

.list .item {
    box-sizing: border-box;
    break-inside: avoid;
    overflow: hidden;
    margin: 5px;
}

.list .item .photo {
    width: 100%;
}

.list .item .photo .el-image {
    width: 100%;
}

.list .item .title {
    font-size: 12px;
    line-height: 14px;
    word-break: break-all;
    padding-bottom: 10px;
}

.slider-block {
    width: 660px;
    padding: 0px 10px;
    display: flex;
}

.slider-block .demonstration {
    font-size: 12px;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
    padding: 0px 20px;
}

.total {
    font-size: 12px;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
    padding: 0px 20px;
}
</style>