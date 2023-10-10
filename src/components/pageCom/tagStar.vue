<template>
    <div>
        <tagHeaderVue :title="$t('defaultTag.starRating')" @updataCondition="updataCondition"
            @updateDeployableState="updateDeployableState" :conditionItem="props.conditionItem"></tagHeaderVue>
        <div class="tagStar" v-if="tagDeployableState">
            <div class="tagStarLeft fixedWidth">
                <tagSpan :text="$t('tag.all')" @click="selectHandle('all' as never)" :select="selectStatus('all')">
                </tagSpan>
                <tagSpan :text="$t('tag.noStar')" @click="selectHandle(0 as never)" :select="selectStatus(0)">
                    ></tagSpan>
            </div>
            <div class="tagStarRight">
                <div class="starItem" v-for="(star, index) in starData" :key="index" @click="selectHandle(star as never)"
                    :select="selectStatus(star as never)">
                    <el-rate :class="[selectStatus(star) !== false ? 'select' : 'noSelect']" v-model="starData[index]"
                        disabled />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import tagHeaderVue from "./tagHeader.vue"
import tagSpan from "../smallCom/tagSpan.vue"
import { EsearchLogic } from "@/dataInterface/common.enum";
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

const starData = ref([1, 2, 3, 4, 5]);

const selectValArr = ref([]);
const searchLogic = ref(EsearchLogic.single);
const tagDeployableState = ref(true);

const updateData = () => {
    emits('updateData', 'starRating', searchLogic.value, selectValArr.value)
}

const updataCondition = (searchLogicValue: EsearchLogic) => {
    if (searchLogicValue == EsearchLogic.single && searchLogic.value != EsearchLogic.single) {
        selectValArr.value = [];
    }
    searchLogic.value = searchLogicValue;
    updateData()
}
const updateDeployableState = (deployableState: boolean) => {
    tagDeployableState.value = deployableState;
}

const selectHandle = (val: never) => {
    if (val == 'all') {
        selectValArr.value = [];
    } else if (val == 'noStar') {
        selectValArr.value = ['noStar' as never];
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
    updateData()
}

const selectStatus = (val: string | number) => {
    if (val == 'all' && selectValArr.value.length == 0) {
        return true;
    } else if (val == 'noStar' && selectValArr.value[0] == 'noStar') {
        return true;
    } else if (selectValArr.value.indexOf(val as never) > -1) {
        return true;
    }
    return false;
}

</script>
<style scoped>
.tagStar {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.tagStar .tagStarRight .select {
    background-color: #fc8a09;
}

.tagStarLeft {
    width: 19.6%;
    display: block;
}

.tagStar .fixedWidth span {
    width: 100%;
    padding: 0px 6px;
}

.tagStarRight {
    width: 70%;
    padding-left: 5%;
}


.tagStarRight .starItem .el-rate {
    height: 18px;
    cursor: pointer;
}



.tagStarRight .starItem .el-rate:hover {
    background-color: #FFAA47;
}

.el-rate.is-disabled>>>.el-rate__item {
    cursor: pointer;
}

.select {
    color: #FFFFFF;
    background-color: #FFAA47;
}
</style>