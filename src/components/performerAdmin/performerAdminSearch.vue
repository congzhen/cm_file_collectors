<template>
    <div class="paSearch">
        <div class="performerSearch item">
            <el-input v-model="queryCondition.search"
                :placeholder="$t('performer.pleaseEnterPerformerNameOrAlias', { title: store.filesBasesSettingStore.getPerformerText })"
                @input="throttleSearchHandle" @clear="searchHandle" clearable>
                <template #append>
                    <el-button icon="Search" @click="searchHandle" />
                </template>
            </el-input>
        </div>
        <div class="performerSelect item">
            <el-select v-model="queryCondition.stars" :placeholder="$t('performer.pleaseSelectPerformerStars')"
                @change="searchHandle">
                <el-option :label="$t('performer.starsAll')" value="ALL"></el-option>
                <el-option label="★★★★★" value="5"></el-option>
                <el-option label="★★★★" value="4"></el-option>
                <el-option label="★★★" value="3"></el-option>
                <el-option label="★★" value="2"></el-option>
                <el-option label="★" value="1"></el-option>
                <el-option :label="$t('performer.noStars')" value="noStars"></el-option>
            </el-select>
        </div>
        <div class="performerCup item">
            <el-select v-model="queryCondition.cup"
                :placeholder="$t('plugin.cup.pleaseSelectCup', { cup: store.filesBasesSettingStore.getPlugInUnit_Cup_Text })"
                @change="searchHandle">
                <el-option :label="$t('plugin.cup.cupAll')" value="ALL"></el-option>
                <el-option v-for="item, index in dataset.cup" :key="index" :value="item">
                    <span>
                        {{ item + '-' + store.filesBasesSettingStore.getPlugInUnit_Cup_Text }}
                        <label class="cupPerformerCount">({{ getCupNum(item) }})</label>
                    </span>
                </el-option>
                <el-option :label="$t('plugin.cup.noCup')" value="noCup"></el-option>
            </el-select>
        </div>
    </div>
</template>
<script setup lang="ts">
import dataset from "@/assets/dataset"
import { Throttle } from "@/assets/tool"
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import { filesBasesStore } from "@/store/filesBases.store"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { IperformerQueryCondition } from '@/dataInterface/performer.interface';
import { performerStore } from "@/store/performer.store";
import { ref } from 'vue'

// eslint-disable-next-line no-undef
const emits = defineEmits(['search']);

const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
    filesBasesStore: filesBasesStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
    performerStore: performerStore(),
}
const queryCondition = ref({
    search: '',
    stars: '',
    cup: '',
} as IperformerQueryCondition)

const init = () => {
    queryCondition.value.search = '';
    queryCondition.value.stars = '';
    queryCondition.value.cup = '';
}

const getQueryCondition = () => {
    return queryCondition.value;
}
const getCupNum = (key: string) => {
    return store.performerStore.getPerformerCupNumObject[key];
}
const searchHandle = () => {
    emits('search', queryCondition.value);
}

const throttleClass = new Throttle();
const throttleSearchHandle = () => {
    throttleClass.throttleTimeout(() => {
        searchHandle();
    }, 200);
}

// eslint-disable-next-line no-undef
defineExpose({ getQueryCondition, init });

</script>
<style scoped>
.paSearch {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
}

.paSearch .item {
    margin-right: 7px;
}

.paSearch .performerSearch {
    width: 300px;
    margin-left: 7px;
}

.performerSelect {
    width: 200px;
}

.performerCup {
    width: 200px;
}

.cupPerformerCount {
    font-size: 9px;
    color: #E6A23C;
}
</style>