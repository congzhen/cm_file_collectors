<template>
    <div class="top">
        <label class="title">{{ props.title }}</label>
        <div>
            <tagBlockCondition @updataSelect="updataCondition" :showItem="props.conditionItem"></tagBlockCondition>
        </div>
    </div>
</template>
<script setup lang="ts">
import { EsearchLogic } from "@/dataInterface/common.enum";
import tagBlockCondition from "./tagBlockCondition.vue"
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
const emits = defineEmits(['updataCondition']);

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
}
</style>