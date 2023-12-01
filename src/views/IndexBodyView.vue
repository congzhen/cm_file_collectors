<template>
    <div ref="indexBodyRef" class="indexBody">
        <div ref="indexBodyTagRef" class="indexBodyTag" :style="{ ...leftStype_C, position: leftPosition_C }">
            <IndexTagView></IndexTagView>
        </div>
        <div ref="arrowRef" class="arrow" v-if="store.filesBasesSettingStore.config.leftColumnMode == 'float'"
            @click="openIndexBodyTag">
            <el-icon>
                <ArrowLeftBold v-if="arrowStatus" />
                <ArrowRightBold v-else />
            </el-icon>
        </div>

        <div class="indexBodyMain" :style="mainStype_C">
            <div class="content">
                <div :class="[gerResDataListClass()]">
                    <IndexDataListTableModeView ref="IndexDataListTableRef"
                        v-if="store.filesBasesSettingStore.config.resourcesShowMode == 'table'" :dataList="resDataList"
                        @clickHandle="clickDataHandle"></IndexDataListTableModeView>
                    <IndexDataListView ref="IndexDataListRef" v-else :dataList="resDataList" @clickHandle="clickDataHandle">
                    </IndexDataListView>
                </div>
                <div class="details" v-if="store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right'">
                    <IndexDetailsView ref="IndexDetailsViewRef"></IndexDetailsView>
                </div>
                <IndexDetailsPopupView ref="IndexDetailsPopupViewRef" v-else></IndexDetailsPopupView>
            </div>
            <div class="footer">
                <IndexFooterView ref="IndexFooterViewRef" :dataCount="resDataCount" :dataLimit="resWhereObj.limit"
                    @currentChange="currentChange">
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
import { IresUpdateDetailsView } from '@/dataInterface/common.interface';

const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}

const indexBodyRef = ref<HTMLDivElement>();
const IndexDataListRef = ref<InstanceType<typeof IndexDataListView>>();
const IndexDataListTableRef = ref<InstanceType<typeof IndexDataListTableModeView>>();
const IndexFooterViewRef = ref<InstanceType<typeof IndexFooterView>>();
const indexBodyElementData = reactive({
    height: indexBodyRef.value?.offsetHeight,
});
const indexBodyTagRef = ref<HTMLDivElement>();
const arrowRef = ref<HTMLDivElement>();
const IndexDetailsViewRef = ref<InstanceType<typeof IndexDetailsView>>();
const IndexDetailsPopupViewRef = ref<InstanceType<typeof IndexDetailsPopupView>>();
const resDataList = ref<Array<IresourcesBase>>([]);
const resDataCount = ref(0);
const arrowStatus = ref(false);
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


const handleIndexBodyResize = () => {
    indexBodyElementData.height = indexBodyRef.value?.offsetHeight;
}

// eslint-disable-next-line no-undef
const leftStype_C = computed(() => {
    return {
        width: store.filesBasesSettingStore.config.leftColumnWidth + 'px',
        height: store.filesBasesSettingStore.config.leftColumnMode == 'fixed' ? '100%' : indexBodyElementData.height + 'px',
        left: arrowStatus.value ? '0px' : -store.filesBasesSettingStore.config.leftColumnWidth + 'px',
        zIndex: 90,
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

const intiDatalist = () => {
    if (store.filesBasesSettingStore.config.resourcesShowMode == 'table') {
        IndexDataListTableRef.value?.init();
    } else {
        IndexDataListRef.value?.init();
    }
}

const setNowPageAndUpdateData = async (page = 1) => {
    resWhereObj.page = page;
    IndexFooterViewRef.value?.setCurrentPage(page);
    return await updateData();
}

const openIndexBodyTag = () => {
    if (store.filesBasesSettingStore.config.leftColumnMode == 'float' && indexBodyTagRef.value && arrowRef.value) {
        if (arrowStatus.value) {
            indexBodyTagRef.value.style.left = -store.filesBasesSettingStore.config.leftColumnWidth + 'px';
            arrowRef.value.style.left = '0px';
        } else {
            indexBodyTagRef.value.style.left = '0px';
            arrowRef.value.style.left = store.filesBasesSettingStore.config.leftColumnWidth + 'px';
        }
        arrowStatus.value = !arrowStatus.value;
    }
}

const updateData = async () => {
    return await getDataList(store.filesBasesStore.currentFilesBases.id, resWhereObj);
}



const updataDetailsView = async (resUpdateDetailsView: IresUpdateDetailsView | undefined = undefined) => {
    if (store.filesBasesSettingStore.config.resourceDetailsShowMode == 'right') {
        await IndexDetailsViewRef.value?.updateData(resUpdateDetailsView);
    } else {
        await IndexDetailsPopupViewRef.value?.updateData(resUpdateDetailsView);
    }
}

const getDataList = async (filesBases_id: string, _resWhereObj: IresWhereObj) => {
    const resObj = await resourcesServerData.getDataListPagingByFilesBases_id(filesBases_id, _resWhereObj);
    resDataList.value = resObj.dataList;
    resDataCount.value = resObj.dataCount;
    console.log('resObj', resObj);
    return resObj;

}
const currentChange = async (currentPage: number) => {
    resWhereObj.page = currentPage;
    intiDatalist();
    return await updateData();
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
    handleIndexBodyResize();
    await updateData();
    if (resDataList.value.length > 0) {
        IndexDetailsViewRef.value?.show(EresDetatilsType.show, resDataList.value[0]);
    }
});

const resize = () => {
    handleIndexBodyResize();
}

// eslint-disable-next-line no-undef
defineExpose({ updateData, updataDetailsView, setNowPageAndUpdateData, playRes, resize });

</script>
<style scoped>
.indexBody {
    width: 100%;
    height: 100%;
    display: flex;

}

.indexBody .arrow {
    width: 15px;
    height: 80px;
    line-height: 82px;
    overflow: hidden;
    background-color: #409EFF;
    color: #E4E7ED;
    position: fixed;
    top: 50%;
    margin-top: -40px;
    left: 0px;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    z-index: 89;
    cursor: pointer;
    transition: left 0.5s;
}

.indexBody .arrow:hover {
    background-color: #79BBFF;

}

.indexBodyTag {
    width: 319px;
    height: 100%;
    border-right: 1px solid #E4E7ED;
    background-color: #fff;
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