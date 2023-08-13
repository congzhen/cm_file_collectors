<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="dialogTitle" width="1280" top="5vh" :append-to-body="true"
        :close-on-click-modal="false">
        <div class="playComicBody" :style="{ height: getHeihgt() }">
            <div class="left">
                <el-scrollbar ref="previewScrollbarRef" height="100%">
                    <ul class="thumbnail">
                        <li v-for="file, key in     filesList    " :key="key">
                            <div :class="['imgDiv', isSelect(key) ? 'select' : '']" @click="selectNowPage(key)">
                                <el-image :src="folder + '/' + file" fit="scale-down" />
                            </div>
                            <div class="page">({{ key + 1 }})</div>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="right" v-if="filesList">
                <div class="showContent" v-if="store.filesBasesSettingStore.config.playComicMode == 'scaleToOriginal'">
                    <el-scrollbar height="100%">
                        <div class="showContentImage">
                            <el-image :src="folder + '/' + filesList[nowPage]" fit="cover" />
                        </div>
                    </el-scrollbar>
                </div>
                <div class="showContent" v-else>
                    <el-image :src="folder + '/' + filesList[nowPage]" fit="scale-down"
                        style="width: 100%; height: 100%;" />
                </div>
                <div class="btnGroup">
                    <el-button plain size="small" @click="changeNowPage('per')" :disabled="nowPage <= 0">{{
                        $t('play.comic.perPage') }}</el-button>
                    <label class="nowPageLabel">{{ $t('play.comic.nowPage', { page: (nowPage + 1) }) }}</label>
                    <el-button plain size="small" @click="changeNowPage('last')"
                        :disabled="nowPage >= filesList.length - 1">{{ $t('play.comic.lastPage') }}</el-button>
                    <div class="showMode">
                        <el-icon size="26" @click="changeShowMode">
                            <ScaleToOriginal
                                v-if="store.filesBasesSettingStore.config.playComicMode == 'scaleToOriginal'" />
                            <FullScreen v-else />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { readDir } from "@/assets/file"
import { filesBasesStore } from '@/store/filesBases.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { ref } from "vue"

const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}

const previewScrollbarRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const folder = ref('');
const filesList = ref<Array<string>>();
const nowPage = ref(0);

const getHeihgt = () => {
    return (window.innerHeight - 200) + 'px';
}

const isSelect = (index: number) => {
    return nowPage.value == index;
}
const selectNowPage = (index: number) => {
    nowPage.value = index;
}

const changeShowMode = () => {
    store.filesBasesSettingStore.config.playComicMode = store.filesBasesSettingStore.config.playComicMode == 'scaleToOriginal' ? 'fullScreen' : 'scaleToOriginal';
    store.filesBasesSettingStore.save(store.filesBasesStore.currentFilesBases.id);
}

const changeNowPage = (mode: string) => {
    if (filesList.value) {
        if (mode == 'per' && nowPage.value > 0) {
            nowPage.value = nowPage.value - 1;
        } else if (mode == 'last' && nowPage.value < filesList.value.length - 1) {
            nowPage.value = nowPage.value + 1;
        }
    }
}


const show = async (path: string, title = '', _nowPage = 0) => {
    loading.open();
    filesList.value = readDir(path);
    folder.value = path;
    dialogTitle.value = title;
    nowPage.value = _nowPage;
    dialogVisible.value = true;
    await loading.closeSync();
}

// eslint-disable-next-line no-undef
defineExpose({ show });
</script>
<style scoped>
.playComicBody {
    width: 100%;
    display: flex;
}

.left {
    width: 160px;
    height: 100%;
    overflow: hidden;
}

.thumbnail {
    list-style-type: none;
    width: 100%;
}

.thumbnail li {
    width: calc(100% - 10px);
    padding-right: 10px;
    margin-bottom: 10px;
}

.thumbnail li .imgDiv {
    width: calc(100% - 8px);
    overflow: hidden;
    border: 2px solid #E4E7ED;
    padding: 2px;
    cursor: pointer;
}

.thumbnail li .select {
    border-color: tomato;
}

.thumbnail li .page {
    line-height: 16px;
    font-size: 12px;
    text-align: center;
}

.right {
    width: calc(100% - 160px);
    height: 100%;
}

.showContent {
    width: 100%;
    height: calc(100% - 30px);
    overflow: hidden;
}

.showContentImage {
    width: calc(100% - 10px);
}

.btnGroup {
    height: 22px;
    padding-top: 8px;
    display: flex;
    justify-content: center;
}

.nowPageLabel {
    padding: 0px 20px;
    line-height: 22px;
}

.showMode {
    cursor: pointer;
    padding: 0 10px;
}
</style>