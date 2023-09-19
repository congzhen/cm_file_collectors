<template>
    <div ref="indexBodyRef" class="indexBody">
        <div ref="indexBodyTagRef" class="indexBodyTag" :style="{ ...leftStype_C, position: leftPosition_C }"
            @mouseleave.stop="indexBodyTagMove">
            <IndexTagView></IndexTagView>
        </div>
        <div class="arrow" v-if="store.filesBasesSettingStore.config.leftColumnMode == 'float'" @click="openIndexBodyTag">
            <el-icon>
                <ArrowRightBold />
            </el-icon>
        </div>
        <div class="indexBodyMain" :style="mainStype_C">
            <div class="content">
                <div :class="[gerResDataListClass()]">
                    <IndexDataListTableModeView v-if="store.filesBasesSettingStore.config.resourcesShowMode == 'table'"
                        :dataList="resDataList" @clickHandle="clickDataHandle"></IndexDataListTableModeView>
                    <IndexDataListView v-else :dataList="resDataList" @clickHandle="clickDataHandle"></IndexDataListView>
                </div>
                <div class="details" v-if="store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right'">
                    <IndexDetailsView ref="IndexDetailsViewRef"></IndexDetailsView>
                </div>
                <IndexDetailsPopupView ref="IndexDetailsPopupViewRef" v-else></IndexDetailsPopupView>
            </div>
            <div class="footer">
                <IndexFooterView :dataCount="resDataCount" :dataLimit="resWhereObj.limit" @currentChange="currentChange">
                </IndexFooterView>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import IndexTagView from './IndexTagView.vue';
import IndexDataListView from "./IndexDataListView.vue";
import IndexDataListTableModeView from './IndexDataListTableModeView.vue';
import IndexDetailsView from "./IndexDetailsView.vue";
import IndexDetailsPopupView from './IndexDetailsPopupView.vue';
import IndexFooterView from './IndexFooterView.vue';
import { EresDetatilsType } from "@/dataInterface/common.enum"
import { IresWhereObj, IresourcesBase } from "@/dataInterface/resources.interface";
import { resourcesServerData } from "@/serverData/resources.serverData"
import { filesBasesStore } from '@/store/filesBases.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';

import { ref, reactive, onMounted, watch, computed } from 'vue';
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
const indexBodyRef = ref<HTMLDivElement>();
const indexBodyTagRef = ref<HTMLDivElement>();
const IndexDetailsViewRef = ref<InstanceType<typeof IndexDetailsView>>();
const IndexDetailsPopupViewRef = ref<InstanceType<typeof IndexDetailsPopupView>>();
const resDataList = ref<Array<IresourcesBase>>([]);
const resDataCount = ref(0);
const resWhereObj = reactive<IresWhereObj>({
    page: 1,
    limit: store.filesBasesSettingStore.config.pageLimit,
    sortMode: store.filesBasesSettingStore.config.sortMode,
});

watch(
    [
        () => store.filesBasesSettingStore.config.pageLimit,
        () => store.filesBasesSettingStore.config.sortMode,
    ],
    () => {
        resWhereObj.limit = store.filesBasesSettingStore.config.pageLimit;
        resWhereObj.sortMode = store.filesBasesSettingStore.config.sortMode;
        updateData();
    }
);

// eslint-disable-next-line no-undef
const leftStype_C = computed(() => {
    return {
        width: store.filesBasesSettingStore.config.leftColumnWidth + 'px',
        height: store.filesBasesSettingStore.config.leftColumnMode == 'fixed' ? '100%' : indexBodyRef.value?.offsetHeight + 'px',
        left: -store.filesBasesSettingStore.config.leftColumnWidth + 'px',
        zIndex: 90,
        backgroundColor: '#FFFFFF',
    }
})
const leftPosition_C = computed(() => {
    return store.filesBasesSettingStore.config.leftColumnMode == 'fixed' ? 'unset' : 'absolute';
})
const mainStype_C = computed(() => {
    const width = store.filesBasesSettingStore.config.leftColumnMode == 'fixed' ? 'calc(100% - ' + (store.filesBasesSettingStore.config.leftColumnWidth + 1) + 'px)' : '100%';
    return {
        width,
    }
})

const openIndexBodyTag = () => {
    if (store.filesBasesSettingStore.config.leftColumnMode == 'float' && indexBodyTagRef.value) {
        indexBodyTagRef.value.style.left = '0px';
    }
}
const indexBodyTagMove = () => {
    if (store.filesBasesSettingStore.config.leftColumnMode == 'float' && indexBodyTagRef.value) {
        indexBodyTagRef.value.style.left = -store.filesBasesSettingStore.config.leftColumnWidth + 'px';
    }
}

const updateData = async () => {
    await getDataList(store.filesBasesStore.currentFilesBases.id, resWhereObj);
}
const updataDetailsView = async () => {
    if (store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right') {
        await IndexDetailsViewRef.value?.updateData();
    } else {
        await IndexDetailsPopupViewRef.value?.updateData();
    }
}

const getDataList = async (filesBases_id: string, _resWhereObj: IresWhereObj) => {
    const resObj = await resourcesServerData.getDataListPagingByFilesBases_id(filesBases_id, _resWhereObj);
    resDataList.value = resObj.dataList;
    resDataCount.value = resObj.dataCount;
    console.log('resObj', resObj);
}
const currentChange = async (currentPage: number) => {
    resWhereObj.page = currentPage;
    await updateData();
}

const clickDataHandle = (type: EresDetatilsType, dataInfo: IresourcesBase) => {
    if (store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right') {
        IndexDetailsViewRef.value?.show(type, dataInfo);
    } else {
        IndexDetailsPopupViewRef.value?.show(type, dataInfo);
    }
}

const playRes = (dataInfo: IresourcesBase) => {
    clickDataHandle(EresDetatilsType.show, dataInfo);
}

const gerResDataListClass = () => {
    if (store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right') {
        return 'dataList';
    } else {
        return 'dataListDetailsPopup';
    }
}

onMounted(async () => {
    await updateData();
    if (resDataList.value.length > 0) {
        IndexDetailsViewRef.value?.show(EresDetatilsType.show, resDataList.value[0]);
    }
});

// eslint-disable-next-line no-undef
defineExpose({ updateData, updataDetailsView, playRes });

</script>
<style scoped>
.indexBody {
    width: 100%;
    height: 100%;
    display: flex;

}

.indexBody .arrow {
    width: 18px;
    height: 40px;
    line-height: 42px;
    overflow: hidden;
    background-color: #409EFF;
    color: #E4E7ED;
    position: fixed;
    top: 50%;
    margin-top: -10px;
    left: 0px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    z-index: 89;
    cursor: pointer;
}

.indexBody .arrow:hover {
    background-color: #79BBFF;
}

.indexBodyTag {
    width: 319px;
    height: 100%;
    border-right: 1px solid #E4E7ED;
    transition: left 0.5s;
}

.indexBodyMain {
    width: calc(100% - 320px);
    height: 100%;
}

.indexBodyMain .content {
    width: 100%;
    height: calc(100% - 36px);
    display: flex;
}

.dataList {
    width: calc(100% - 285px);
    height: 100%;
}

.dataListDetailsPopup {
    width: 100%;
    height: 100%;
}

.indexBodyMain .details {
    width: 285px;
    height: 100%;
}

.indexBodyMain .footer {
    width: 100%;
    height: 36px;

}
</style>