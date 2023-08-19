<template>
    <div class="paMain">

        <div class="paInfo">
            <performerAdminInfo ref="performerAdminInfoRef"></performerAdminInfo>
        </div>
        <div class="paIndex">
            <performerAdminIndex ref="performerAdminIndexRef" @index="indexHandle"></performerAdminIndex>
        </div>
        <div class="paList">
            <div class="paListTop">
                <performerAdminSearch ref="performerAdminSearchRef" @search="searchHandle"></performerAdminSearch>
            </div>
            <div class="paDataList">
                <performerAdminDataList :dataList="dataList" @performer-click="performerClick"></performerAdminDataList>
            </div>
            <div class="paFooter">
                <div>
                    <el-pagination layout="total,prev, pager, next,jumper" :total="dataCount"
                        v-model:current-page="currentPage" v-model:page-size="pageSize" :small="true"
                        @current-change="currentChange" />
                </div>
                <div class="settingsPerformer">
                    <div class="selectDatabase">
                        <el-select size="small" v-model="nowPerformerBasesId" @change="changePerformerBases">
                            <el-option
                                v-for="item, key in store.performerBasesStore.getPerformerBasesListByCurrentFilesBases"
                                :key="key" :label="item.name" :value="item.id" />
                        </el-select>
                    </div>
                    <div class="btnI" @click="openPerformerDatabasesAdminDrawer">
                        <el-icon :size="24">
                            <Coin />
                        </el-icon>
                    </div>
                    <div class="btnI" @click="openPerformerRecycle">
                        <el-icon :size="23">
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
        <performerDatabasesAdminDialog ref="performerDatabasesAdminDialogRef"></performerDatabasesAdminDialog>
        <performerAdminRecycle ref="performerAdminRecycleRef"></performerAdminRecycle>
    </div>
</template>
<script setup lang="ts">
//import loading from '@/assets/loading'
import performerAdminInfo from './performerAdminInfo.vue'
import performerAdminIndex from './performerAdminIndex.vue';
import performerAdminSearch from './performerAdminSearch.vue'
import performerAdminDataList from './performerAdminDataList.vue';
import performerDatabasesAdminDialog from '@/components/performerDatabasesAdmin/performerDatabasesAdminDialog.vue'
import performerAdminRecycle from './performerAdminRecycle.vue';
import { filesBasesStore } from "@/store/filesBases.store"
import { performerBasesStore } from "@/store/performerBases.store"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { performerStore } from "@/store/performer.store"
import { Iperformer, IperformerQueryCondition } from '@/dataInterface/performer.interface';
import { ref, onMounted, provide, nextTick, watch } from 'vue'
import { reactive } from 'vue';

const store = {
    filesBasesStore: filesBasesStore(),
    performerBasesStore: performerBasesStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
    performerStore: performerStore(),
}
const performerDatabasesAdminDialogRef = ref<InstanceType<typeof performerDatabasesAdminDialog>>();
const performerAdminRecycleRef = ref<InstanceType<typeof performerAdminRecycle>>();
const performerAdminInfoRef = ref<InstanceType<typeof performerAdminInfo>>();
const performerAdminIndexRef = ref<InstanceType<typeof performerAdminIndex>>();
const performerAdminSearchRef = ref<InstanceType<typeof performerAdminSearch>>();
const nowPerformerBasesId = ref(store.filesBasesStore.getCurrentFilesMainPerformerBasesId);

const dataList = ref([] as Array<Iperformer>);
const dataCount = ref(1);
const currentPage = ref(1);
const pageSize = ref(32);
const queryCondition = reactive({
    search: '',
    stars: '',
    cup: '',
    index: 'ALL',
} as IperformerQueryCondition);

watch(() => store.filesBasesStore.getCurrentFilesMainPerformerBasesId, (newValue) => {
    nowPerformerBasesId.value = newValue;
    updateData();
});

const init = () => {
    dataList.value = [];
    dataCount.value = 0;
    currentPage.value = 1;
    queryCondition.search = '';
    queryCondition.stars = '';
    queryCondition.cup = '';
    queryCondition.index = 'ALL';
    performerAdminIndexRef.value?.init();
    performerAdminSearchRef.value?.init();
}

const openPerformerDatabasesAdminDrawer = () => {
    performerDatabasesAdminDialogRef.value?.open();
}
const openPerformerRecycle = () => {
    if (nowPerformerBasesId.value) {
        performerAdminRecycleRef.value?.open(nowPerformerBasesId.value);
    }
}
const currentChange = () => {
    updateData();
}
const changePerformerBases = (performerBases_id: string) => {
    store.performerStore.currentAdminPerformerBases_id = performerBases_id;
    init();
    updateData();
}
const updateData = async () => {
    if (nowPerformerBasesId.value) {
        await getData(nowPerformerBasesId.value);
        updatePerformerInfo();
    }
}
const getData = async (performerBasesId: string) => {
    //loading.open();
    const performerListPaging = store.performerStore.getPerformerListPaging(performerBasesId, currentPage.value, pageSize.value, queryCondition);
    dataList.value = performerListPaging.dataList;
    dataCount.value = performerListPaging.count
    //await loading.closeSync();
}
const indexHandle = async (index: string) => {
    queryCondition.index = index;
    await updateData();
}
const searchHandle = async (_query: IperformerQueryCondition) => {
    queryCondition.search = _query.search;
    queryCondition.stars = _query.stars;
    queryCondition.cup = _query.cup;
    currentPage.value = 1;
    await updateData();
}


const updatePerformerInfo = () => {
    performerAdminInfoRef.value?.updatePerformerInfo();
}
const setCurrentPerformerId = (id: string) => {
    performerAdminInfoRef.value?.setCurrentPerformerId(id);
}
const performerClick = (performer: Iperformer) => {
    setCurrentPerformerId(performer.id);
}

onMounted(async () => {
    nextTick(async () => {
        await updateData();
        if (dataList.value.length > 0) {
            setCurrentPerformerId(dataList.value[0].id);
        }
    })
})
provide('updatePerformerAdminMainData', updateData);

</script>
<style scoped>
.paMain {
    width: 100%;
    height: 620px;
    display: flex;
}


.paMain .paInfo {
    width: 270px;
    height: 100%;
}

.paMain .paIndex {
    width: 40px;
    padding: 0px 0px 0px 7px;
}

.paMain .paList {
    width: 920px;
}

.paMain .paList .paListTop {
    width: 100%;
    padding-bottom: 2px;
    height: 36px;
}

.paMain .paList .paDataList {
    width: 100%;
    height: calc(100% - 38px - 38px);
}

.paMain .paList .paFooter {
    width: calc(97% - 5px);
    border-radius: 2px;
    margin-left: 7px;
    margin-top: 3px;
    padding-top: 6px;
    padding-left: 7px;
    height: 29px;
    overflow: hidden;
    color: #606266;
    background-color: #f2f2f5;
    display: flex;
    justify-content: space-between;
}

.settingsPerformer {
    display: flex;
    padding-right: 10px;
}

.settingsPerformer .selectDatabase {
    padding-right: 10px;
}

.settingsPerformer .btnI {
    cursor: pointer;
    margin: 0 5px;
}

.settingsPerformer .btnI:hover {
    color: #5CB6FF;
}
</style>