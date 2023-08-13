<template>
    <div class="tagBlock">
        <tagHeaderVue :title="props.title" @updataCondition="updataCondition" :conditionItem="props.conditionItem">
        </tagHeaderVue>
        <div class="tagList fixedWidth">
            <tagSpan :text="$t('tag.all')" @click="selectHandle('all' as never)" :select="selectStatus('all')"></tagSpan>
            <tagSpan v-for="item, key in props.dataList" :key="key" :text="item.name"
                @click="selectHandle(item.value as never)" :select="selectStatus(item.value)">
            </tagSpan>
        </div>
    </div>
</template>
<script setup lang="ts">
import tagHeaderVue from "./tagHeader.vue"
import tagSpan from "../smallCom/tagSpan.vue"
import { ItagBlockItem } from "@/dataInterface/common.interface";
import { ref } from 'vue'
import { EsearchLogic } from "@/dataInterface/common.enum";
// eslint-disable-next-line no-undef
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    dataList: {
        type: Array as () => ItagBlockItem[],
        required: true,
    },
    conditionItem: {
        type: Array,
        default: () => {
            return [EsearchLogic.single, EsearchLogic.or, EsearchLogic.and, EsearchLogic.not];
        }
    },
    mode: {
        type: String,
        default: '',
    }
})

// eslint-disable-next-line no-undef
const emits = defineEmits(['updateData']);

const selectValArr = ref([]);
const searchLogic = ref(EsearchLogic.single);

const updateData = () => {
    emits('updateData', props.mode, searchLogic.value, selectValArr.value)
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
    } else {
        if (searchLogic.value == EsearchLogic.single) {
            selectValArr.value = [val];
        } else {
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
    } else if (selectValArr.value.indexOf(val as never) > -1) {
        return true;
    }
    return false;
}

</script>
<style scoped>
.tagBlock .tagList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
</style>