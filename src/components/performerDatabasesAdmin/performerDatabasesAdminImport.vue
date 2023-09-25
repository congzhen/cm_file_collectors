<template>
    <comForm ref="comFormRef" :formTitle="$t('performerDatabases.importPerformerDatabases')" :modelValue="formData"
        :rules="formRules" dialogWidth="600px" labelWidth="160px" @submit="submitForm">
        <el-form-item :label="$t('performerDatabases.importTo')" prop="performerDatabaseId">
            <el-select v-model="formData.performerDatabaseId" prop="performerDatabaseId">
                <el-option v-for="item, key in store.performerBasesStore.performerBasesList" :key="key" :label="item.name"
                    :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item :label="$t('performerDatabases.importTo')" prop="importFile">
            <el-input v-model="formData.importFile" disabled />
            <div style="padding:5px 0;">
                <el-button @click="performerDatabases">{{ $t('performerDatabases.selectImportFile') }}</el-button>
            </div>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="formData.sameNameNoImport" :label="$t('performerDatabases.sameNameNoImport')" />
        </el-form-item>
    </comForm>
</template>
<script setup lang="ts">
import { ipcRendererSend } from "@/electronCommon"
import loading from '@/assets/loading'
import { importPerformer } from '@/assets/performerExportAndImport'
import { ElMessage } from 'element-plus'
import comForm from "@/components/common/comForm.vue"
import { filesBasesStore } from "@/store/filesBases.store"
import { performerBasesStore } from "@/store/performerBases.store"
import { reactive, ref, inject } from 'vue'
import type { FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
const AppInitPerformerData = inject<() => void>('AppInitPerformerData');
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    performerBasesStore: performerBasesStore(),
}
const comFormRef = ref<InstanceType<typeof comForm>>();
const formData = reactive({
    performerDatabaseId: '',
    importFile: '',
    sameNameNoImport: true,
})
const formRules = reactive<FormRules>({
    performerDatabaseId: [{ required: true, trigger: 'blur', message: t('performerDatabases.selectImportPerformerDatabases') }],
    importFile: [{ required: true, trigger: 'blur', message: t('performerDatabases.selectImportFile') }],
})

const performerDatabases = () => {
    const fileName = ipcRendererSend.dialogGetFileSync();
    if (fileName != undefined) {
        formData.importFile = fileName;
    }
}

const submitForm = () => {
    if (formData.importFile == '' || formData.performerDatabaseId == '') {
        return
    }
    loading.open();
    setTimeout(async () => {
        const rd = await importPerformer(formData.performerDatabaseId, formData.importFile, formData.sameNameNoImport);
        await loading.closeSync();
        if (rd === false) {
            ElMessage({
                message: t('performerDatabases.message.importError'),
                type: 'error',
            })
        } else {
            ElMessage({
                message: t('performerDatabases.message.importSuccess', rd),
                type: 'success',
            })
            if (AppInitPerformerData) AppInitPerformerData();
        }
    }, 500);
}

const open = () => {
    comFormRef.value?.open('add');
}
// eslint-disable-next-line no-undef
defineExpose({ open });

</script>