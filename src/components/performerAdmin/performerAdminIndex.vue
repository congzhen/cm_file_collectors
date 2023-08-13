<template>
    <div :class="['divIndex', nowSelectIndex == item ? 'select' : 'noSelect']" v-for="(item, index) in indexList"
        :key="index" @click="clickHandle(item)">{{
            item }}</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// eslint-disable-next-line no-undef
const emits = defineEmits(['index']);

const nowSelectIndex = ref('ALL')
const indexList = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const init = () => {
    nowSelectIndex.value = 'ALL';
}

const clickHandle = (index: string) => {
    nowSelectIndex.value = index;
    emits('index', index);
}

// eslint-disable-next-line no-undef
defineExpose({ init });
</script>
<style scoped>
.divIndex {
    width: 100%;
    text-align: center;
    height: 21px;
    line-height: 21px;
    margin-bottom: 2px;
    cursor: pointer;
    user-select: none;
    color: #FFFFFF;
}

.divIndex:hover {
    background-color: #E67F23;
}

.noSelect {
    background-color: #606266;
}

.select {
    background-color: #E67F23;
}
</style>