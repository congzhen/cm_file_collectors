<template>
    <div class="tagPerformer">
        <tagHeaderVue :title="$t('defaultTag.performer')" @updataCondition="updataCondition"
            :conditionItem="props.conditionItem">
        </tagHeaderVue>
        <div class="tagList">
            <tagSpan :text="$t('tag.all')" @click="selectHandle('all' as never)" :select="selectStatus('all')"></tagSpan>
            <tagSpan :text="$t('tag.noPerformer')" @click="selectHandle('noPerformer' as never)"
                :select="selectStatus('noPerformer')"></tagSpan>
        </div>
        <div class="performerList" v-if="store.filesBasesSettingStore.config.performerPhoto">
            <performerCom v-for="item, key in getDataList()" :key="key" :performerInfo="item"
                @click="selectHandle(item.id as never)" :select="selectStatus(item.id)"></performerCom>
        </div>
        <div class="performerList" v-else>
            <tagSpan v-for="item, key in getDataList()" :key="key" :text="item.name" @click="selectHandle(item.id as never)"
                :select="selectStatus(item.id)"></tagSpan>
        </div>
    </div>
</template>
<script setup lang="ts">
import tagHeaderVue from "./tagHeader.vue"
import tagSpan from "@/components/smallCom/tagSpan.vue"
import performerCom from "@/components/smallCom/performerCom.vue"
import { performerStore } from "@/store/performer.store";
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import { Iperformer } from "@/dataInterface/performer.interface";
import { EsearchLogic } from "@/dataInterface/common.enum";
import { ref } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
    conditionItem: {
        type: Array,
        default: () => {
            return [EsearchLogic.single, EsearchLogic.or, EsearchLogic.and, EsearchLogic.not];
        }
    }
})
// eslint-disable-next-line no-undef
const emits = defineEmits(['updateData']);

const store = {
    performerStore: performerStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
const selectValArr = ref([]);
const searchLogic = ref(EsearchLogic.single);

const getDataList = () => {
    const performerArr: Array<Iperformer> = [];
    store.filesBasesSettingStore.config.performerPreferred.forEach((perId: string) => {
        const perInfo = store.performerStore.getPerformerInfoById(perId);
        if (perInfo && performerArr.length < store.filesBasesSettingStore.config.performerShowNum) {
            performerArr.push(perInfo)
        }
    });
    let lack = store.filesBasesSettingStore.config.performerShowNum - performerArr.length;
    if (lack > 0) {
        for (let i = 0; i < store.performerStore.getPerformerListByFilesBasesId.length; i++) {
            if (store.filesBasesSettingStore.config.shieldNoPerformerPhoto && store.performerStore.getPerformerListByFilesBasesId[i].photo == '') {
                continue;
            }
            if (lack > 0 && !performerArr.some(obj => obj.id == store.performerStore.getPerformerListByFilesBasesId[i].id)) {
                lack--;
                performerArr.push(store.performerStore.getPerformerListByFilesBasesId[i]);
            }
            if (lack <= 0) {
                break;
            }
        }
    }
    return performerArr;
}

const updateData = () => {
    emits('updateData', 'performer', searchLogic.value, selectValArr.value)
}


const updataCondition = (searchLogicValue: EsearchLogic) => {
    if (searchLogicValue == EsearchLogic.single && searchLogic.value != EsearchLogic.single) {
        selectValArr.value = [];
    }
    searchLogic.value = searchLogicValue;
    updateData();
}

const selectHandle = (val: never) => {
    if (val == 'all') {
        selectValArr.value = [];
    } else if (val == 'noPerformer') {
        selectValArr.value = ['noPerformer' as never];
    } else {
        if (searchLogic.value == EsearchLogic.single) {
            selectValArr.value = [val];
        } else {
            const noPerformerIndex = selectValArr.value.findIndex(item => item == 'noPerformer');
            if (noPerformerIndex > -1) {
                selectValArr.value.splice(noPerformerIndex, 1);
            }
            const index = selectValArr.value.findIndex(item => item == val);
            if (index > -1) {
                selectValArr.value.splice(index, 1);
            } else {
                selectValArr.value.push(val);
            }
        }
    }
    updateData();
}

const selectStatus = (val: string) => {
    if (val == 'all' && selectValArr.value.length == 0) {
        return true;
    } else if (val == 'noPerformer' && selectValArr.value[0] == 'noPerformer') {
        return true;
    } else if (selectValArr.value.indexOf(val as never) > -1) {
        return true;
    }
    return false;
}

</script>
<style scoped>
.tagList {
    display: flex;
}

.performerList {
    display: flex;
    flex-wrap: wrap;
    padding-left: 2px;
}

.performerList .performerCom {
    margin: 0px 3px 3px 0px;
}
</style>