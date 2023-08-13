<template>
    <div class="performerDataList">
        <el-scrollbar height="100%">
            <div class="performerDataListBody">
                <performerCom v-for="item, key in props.dataList" :key="key" mode="brief" :performerInfo="item"
                    @click="clickPerformer(item)" @showPerRes="showPerRes">
                </performerCom>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import { searchStore } from '@/store/search.store'
import performerCom from '@/components/smallCom/performerCom.vue';
import { Iperformer } from '@/dataInterface/performer.interface';
import { EresUpdate, EsearchLogic } from '@/dataInterface/common.enum';
import { inject } from 'vue'
const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const store = {
    searchStore: searchStore(),
}
// eslint-disable-next-line no-undef
const props = defineProps({
    dataList: {
        type: Array as () => Iperformer[],
        required: true,
    }
});
// eslint-disable-next-line no-undef
const emits = defineEmits(['performer-click']);

const clickPerformer = (item: Iperformer) => {
    emits('performer-click', item)
}

const showPerRes = (performerInfo: Iperformer) => {
    store.searchStore.setSearchData('performer', EsearchLogic.single, [performerInfo.id]);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}

</script>
<style scoped>
.performerDataList {
    width: 100%;
    height: 100%;
}

.performerDataListBody {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 4px 0px 4px;
}

.performerDataListBody .performerCom {
    margin: 0px 4px 8px 4px;
    width: 104px;
    font-size: 14px;
}
</style>