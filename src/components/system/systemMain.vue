<template>
    <el-tabs tab-position="left" style="height: 100%">
        <el-tab-pane :label="$t('system.tags.softConfig')">
            <systemSubSoftConfig ref="systemSubSoftConfigRef"></systemSubSoftConfig>
        </el-tab-pane>
        <el-tab-pane :label="$t('system.tags.updateLogs')">
            <systemSubUpdateLogs></systemSubUpdateLogs>
        </el-tab-pane>
        <el-tab-pane :label="$t('system.tags.aboutSoftware')">
            <systemSubAboutSoftware></systemSubAboutSoftware>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup lang="ts">
import systemSubSoftConfig from './systemSubSoftConfig.vue';
import systemSubUpdateLogs from './systemSubUpdateLogs.vue';
import systemSubAboutSoftware from './systemSubAboutSoftware.vue';
import loading from '@/assets/loading'
import { ref } from 'vue'

const systemSubSoftConfigRef = ref<InstanceType<typeof systemSubSoftConfig>>();

const saveSystem = async () => {
    loading.open();
    systemSubSoftConfigRef.value?.saveSoftConfig();
    await loading.closeSync();
}

// eslint-disable-next-line no-undef
defineExpose({ saveSystem })

</script>