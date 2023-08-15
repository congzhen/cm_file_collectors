<template>
    <div class="tagList">
        <el-tag v-for="item, key in store.searchStore.searchCondition.country.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.country.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.country.value, key)" closable>
            {{ $t('country.' + item) }}
        </el-tag>
        <el-tag v-for="item, key in store.searchStore.searchCondition.definition.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.definition.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.definition.value, key)" closable>
            {{ $t('definition.' + item) }}
        </el-tag>
        <el-tag v-for="item, key in store.searchStore.searchCondition.year.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.year.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.year.value, key)" closable>
            {{ getYearText(item) }}
        </el-tag>
        <el-tag v-for="item, key in store.searchStore.searchCondition.starRating.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.starRating.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.starRating.value, key)" closable>
            {{ getStarRatingText(item) }}
        </el-tag>
        <el-tag v-for="item, key in store.searchStore.searchCondition.performer.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.performer.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.performer.value, key)" closable>
            {{ getPerformerText(item) }}
        </el-tag>
        <el-tag v-for="item, key in store.searchStore.searchCondition.cup.value" :key="key"
            :type="tagType(store.searchStore.searchCondition.cup.logic)" size="large"
            @close="closeTag(store.searchStore.searchCondition.cup.value, key)" closable>
            {{ item + '-' + store.filesBasesSettingStore.getPlugInUnit_Cup_Text }}
        </el-tag>
        <div v-for="tagClass, tagClassKey in store.searchStore.searchCondition.diyTag" :key="tagClassKey">
            <el-tag v-for="item, key in tagClass.value" :key="key" :type="tagType(tagClass.logic)" size="large"
                @close="closeTag(tagClass.value, key)" closable>
                {{ store.tagStore.getTagById(item)?.name }}
            </el-tag>
        </div>
    </div>
</template>
<script setup lang="ts">
import { EresUpdate, EsearchLogic } from '@/dataInterface/common.enum';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { searchStore } from '@/store/search.store'
import { performerStore } from '@/store/performer.store';
import { tagStore } from '@/store/tag.store';
import { useI18n } from 'vue-i18n';
import { inject } from 'vue'

const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const { t } = useI18n();
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
    searchStore: searchStore(),
    performerStore: performerStore(),
    tagStore: tagStore(),
}
const tagType = (logic: EsearchLogic) => {
    switch (logic) {
        case EsearchLogic.single:
            return '';
        case EsearchLogic.or:
            return 'warning';
        case EsearchLogic.and:
            return 'danger';
        case EsearchLogic.not:
            return 'info'
    }
    return '';
}

const getYearText = (v: string) => {
    if (v == 'Before2000') {
        return t('tagYear.before2000');
    } else {
        return t('tagYear.year', { year: v });
    }
}
const getStarRatingText = (v: string) => {
    if (v == 'noStar') {
        return t('tag.noStar');
    } else {
        return t('tag.star', { star: v });
    }
}
const getPerformerText = (v: string) => {
    if (v == 'noPerformer') {
        return t('tag.noPerformer');
    } else {
        return store.performerStore.getPerformerInfoById(v)?.name;
    }
}

const closeTag = (a: string[], index: number) => {
    a.splice(index, 1);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}

</script>
<style scoped>
.tagList {
    display: flex;
    padding-left: 10px;
    height: 32px;
    overflow: hidden;
}

.tagList .el-tag {
    margin: 0px 0px 5px 5px;
}
</style>