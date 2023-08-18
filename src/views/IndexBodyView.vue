<template>
    <div class="indexBody">
        <div class="indexBodyTag">
            <IndexTagView></IndexTagView>
        </div>
        <div class="indexBodyMain">
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

import { ref, reactive, onMounted, watch } from 'vue';
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
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

const updateData = async () => {
    await getDataList(store.filesBasesStore.currentFilesBases.id, resWhereObj);
}
const updataDetailsView = async () => {
    await IndexDetailsViewRef.value?.updateData();
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
defineExpose({ updateData, updataDetailsView });

</script>
<style scoped>
.indexBody {
    width: 100%;
    height: 100%;
    display: flex;
}

.indexBodyTag {
    width: 319px;
    height: 100%;
    border-right: 1px solid #E4E7ED;
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