<template>
    <div class="tagView">
        <el-scrollbar height="100%">
            <div class="tagViewList">
                <div class="tagCom" v-for="item, key in store.filesBasesSettingStore.config.leftDisplay" :key="key">
                    <tagStar v-if="item == 'starRating'" :conditionItem="logic1" @updateData="updateDataCondition">
                    </tagStar>
                    <div v-else-if="item == 'performer'">
                        <tagPerformer :conditionItem="logic0" @updateData="updateDataCondition"></tagPerformer>
                        <tagBlock v-if="store.filesBasesSettingStore.config.plugInUnit_Cup"
                            :title="store.filesBasesSettingStore.getPlugInUnit_Cup_Text" :dataList="getDataList('cup')"
                            :conditionItem="logic0" @updateData="updateDataCondition" mode="cup" style="margin-top: 10px;">
                        </tagBlock>
                    </div>
                    <div v-else-if="item == 'diyTag'">
                        <tagBlock class="tagCom"
                            v-for="item, key in store.tagClassStore.getTagClassListByCurrentFilesBases.filter(item => item.leftShow)"
                            :key="key" :title="item.name" :dataList="getTagDataList(item.id)"
                            @updateData="updateDataCondition" :mode="item.id"></tagBlock>
                    </div>
                    <tagBlock v-else :title="$t('defaultTag.' + item)" :dataList="getDataList(item)" :conditionItem="logic1"
                        @updateData="updateDataCondition" :mode="item"></tagBlock>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import dataset from '@/assets/dataset';
import tagBlock from '@/components/pageCom/tagBlock.vue';
import tagStar from '@/components/pageCom/tagStar.vue'
import tagPerformer from '@/components/pageCom/tagPerformer.vue';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { tagClassStore } from '@/store/tagClass.store';
import { tagStore } from '@/store/tag.store';
import { searchStore } from '@/store/search.store'
import { useI18n } from 'vue-i18n';
import { ItagBlockItem } from '@/dataInterface/common.interface';
import { EresUpdate, EsearchLogic } from '@/dataInterface/common.enum';
import { inject } from 'vue'
const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const { t } = useI18n();
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
    tagClassStore: tagClassStore(),
    tagStore: tagStore(),
    searchStore: searchStore(),
}
const logic0 = [EsearchLogic.single, EsearchLogic.or, EsearchLogic.and]
const logic1 = [EsearchLogic.single, EsearchLogic.or]


const getDataList = (item: string) => {
    if (item == 'country') {
        return store.filesBasesSettingStore.config.country.map((data) => {
            return {
                name: t('country.' + data),
                value: data,
            } as ItagBlockItem
        });
    } else if (item == 'definition') {
        return store.filesBasesSettingStore.config.definition.map((data) => {
            return {
                name: t('definition.' + data),
                value: data,
            } as ItagBlockItem;
        });
    } else if (item == 'year') {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const yearArr: Array<ItagBlockItem> = [];
        for (let i = currentYear; i > 2000; i--) {
            yearArr.push({
                name: t('tagYear.year', { year: i }),
                value: i.toString(),
            })
        }
        yearArr.push({
            name: t('tagYear.before2000'),
            value: 'Before2000',
        })
        return yearArr;
    } else if (item == 'cup') {
        const cupArr: Array<ItagBlockItem> = [];
        dataset.cup.forEach(item => {
            cupArr.push({
                name: item + '-' + store.filesBasesSettingStore.getPlugInUnit_Cup_Text,
                value: item,
            })
        })
        return cupArr;
    }
    return [];
}
const getTagDataList = (tagClass_id: string) => {
    return store.tagStore.getTagListByTagClassId(tagClass_id).map((tag) => {
        return {
            name: tag.name,
            value: tag.id,
        } as ItagBlockItem;
    })
}

const updateDataCondition = (mode: string, logic: EsearchLogic, selectVal: string[]) => {
    store.searchStore.setSearchData(mode, logic, selectVal);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}

</script>
<style scoped>
.tagView {
    width: 100%;
    height: 100%;
}

.tagViewList {
    padding: 0px 10px 20px 10px;
}

.tagCom {
    padding-bottom: 10px;
}
</style>