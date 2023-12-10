<template>
    <div class="top">
        <div class="title" @click="toggleDeployableState">
            <el-icon v-if="deployableState">
                <ArrowDown />
            </el-icon>
            <el-icon v-else>
                <ArrowRight />
            </el-icon>
            <span>{{ props.title }}</span>
        </div>
        <div v-if="props.conditionItem.length != 0">
            <tagBlockCondition @updataSelect="updataCondition" :showItem="props.conditionItem"></tagBlockCondition>
        </div>
    </div>
</template>
<script setup lang="ts">
import { EsearchLogic } from "@/dataInterface/common.enum";
import tagBlockCondition from "./tagBlockCondition.vue"
import { ref } from 'vue'
// eslint-disable-next-line no-undef
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    conditionItem: {
        type: Array,
        default: () => {
            return [EsearchLogic.single, EsearchLogic.or, EsearchLogic.and, EsearchLogic.not];
        }
    }
})
// eslint-disable-next-line no-undef
const emits = defineEmits(['updataCondition', 'updateDeployableState']);


const deployableState = ref(true);

const toggleDeployableState = () => {
    deployableState.value = !deployableState.value;
    emits('updateDeployableState', deployableState.value)
}

const updataCondition = (selectValue: EsearchLogic) => {
    emits('updataCondition', selectValue);
}

</script>
<style scoped>
.top {
    display: flex;
    justify-content: space-between;
}

.title {
    font-size: 14px;
    font-weight: bold;
    text-indent: 2px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    display: flex;
    cursor: pointer;
    user-select: none;
}

.title:hover {
    color: #409EFF;
}

.title .el-icon {
    margin: 2px 2px 0 0;
    display: block;
}
</style>