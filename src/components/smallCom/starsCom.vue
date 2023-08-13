<template>
    <div class="starsCom">
        <el-icon v-for="index in props.starsNumber" :key="index" :size="props.size">
            <StarFilled color="#F7BA2A" />
        </el-icon>
        <el-icon v-for="index in 5 - props.starsNumber" :key="index" :size="props.size">
            <StarFilled :size="props.size" color="#606266" />
        </el-icon>
    </div>
</template>
<script setup lang="ts">
// eslint-disable-next-line no-undef
const props = defineProps({
    starsNumber: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        default: 26
    }
})
</script>
<style scoped>
.starsCom {
    display: flex;
}
</style>