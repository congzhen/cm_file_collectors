<template>
    <div :class="[props.class]">
        <el-image v-if="imageStatus" :src="props.src" fit="cover" @error="errorImage"></el-image>
        <el-image v-else :src="store.filesBasesSettingStore.getAvatar" fit="cover"></el-image>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store'
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
}
const imageStatus = ref(true);
// eslint-disable-next-line no-undef
const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    class: {
        type: String,
        default: 'photo'
    }
});
watch(() => props.src, () => {
    imageStatus.value = true;
})
const errorImage = () => {
    imageStatus.value = false;
}


</script>
<style scoped>
.el-image {
    width: 100%;
    height: 100%;
}
</style>