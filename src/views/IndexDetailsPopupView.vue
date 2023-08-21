<template>
    <div class="detailsDialog" v-show="dialogStatus">
        <el-dialog v-model="dialogVisible" width="1024px">
            <div class="settingMainDiv">
                <el-scrollbar height="600px">
                    <IndexDetailsView ref="IndexDetailsViewRef" mode="popup"></IndexDetailsView>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { EresDetatilsType } from '@/dataInterface/common.enum';
import { IresourcesBase } from '@/dataInterface/resources.interface';
import IndexDetailsView from './IndexDetailsView.vue';
import { ref } from 'vue'
const IndexDetailsViewRef = ref<InstanceType<typeof IndexDetailsView>>();
const dialogVisible = ref(true);
const dialogStatus = ref(false);
const updateData = async () => {
    await IndexDetailsViewRef.value?.updateData();
}
const show = async (type: EresDetatilsType, dataInfo: IresourcesBase) => {
    if (type == EresDetatilsType.show) {
        if (!dialogStatus.value) {
            dialogStatus.value = true;
        }
        dialogVisible.value = true;
    }
    IndexDetailsViewRef.value?.show(type, dataInfo);
}

// eslint-disable-next-line no-undef
defineExpose({ show, updateData });

</script>
<style scoped>
.detailsDialog :deep(.el-dialog__title) {
    font-size: 14px;
}

.detailsDialog :deep(.el-dialog__body) {
    padding: 5px 20px 20px 20px;
}

.detailsDialog :deep(.el-dialog__footer) {
    padding: 0px 20px 20px 20px;
}

.settingMainDiv {
    width: 100%;
    height: 600px;
}
</style>