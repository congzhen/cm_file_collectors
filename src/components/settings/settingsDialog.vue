<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('settings.title')" width="800px"
        :close-on-click-modal="false" append-to-body @close="closeSave">
        <div class="settingMainDiv">
            <settingsMain ref="settingsMainRef"></settingsMain>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import settingsMain from './settingsMain.vue';
import { ref, nextTick } from 'vue'
const dialogVisible = ref(false)
const settingsMainRef = ref<InstanceType<typeof settingsMain>>();
const closeSave = () => {
    settingsMainRef.value?.saveSettings();
}


const open = () => {
    dialogVisible.value = true;
    nextTick(() => {
        settingsMainRef.value?.openSettings();
    })
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped>
.settingMainDiv {
    width: 100%;
    height: 600px;
}
</style>