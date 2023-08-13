<template>
    <comForm ref="comFormRef" :formTitle="formTitle" :modelValue="formData" :rules="formRules" dialogWidth="600px"
        labelWidth="160px" @submit="submitForm">
        <el-form-item :label="$t('performerDatabases.name')" prop="name">
            <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="$t('performerDatabases.associatedDatabase')" prop="type">
            <el-checkbox-group v-model="formData.databases">
                <el-checkbox v-for="item, key in store.filesBasesStore.filesBasesList.filter(item => item.status)"
                    :key="key" :label="item.id" :disabled="mode == 'add' ? false : true">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </comForm>
</template>
<script setup lang="ts">
import comForm from "@/components/common/comForm.vue"
import loading from '@/assets/loading'
import { performerBasesStore } from "@/store/performerBases.store"
import { filesBasesStore } from "@/store/filesBases.store";
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { performerBasesServerData } from "@/serverData/performerBases.serverData"
import { reactive, ref, computed } from 'vue'
import type { FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    performerBasesStore: performerBasesStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
}
let formDataId: string | undefined = undefined;
const formData = reactive({
    name: '',
    databases: [],
})
const formRules = reactive<FormRules>({
    name: [{ required: true, trigger: 'blur', message: t('performerDatabases.ruleName') }],
})
const comFormRef = ref<InstanceType<typeof comForm>>();
const mode = ref('add');
const formTitle = computed(() => {
    if (mode.value == 'add') {
        return t('tag.addClass')
    } else {
        return t('tag.editlass')
    }
})
const init = (id: string | undefined = undefined) => {
    formDataId = id;
    if (id) {
        const performerInfo = store.performerBasesStore.getPerformerBasesById(id);
        if (performerInfo) {
            formData.name = performerInfo.name;
            formData.databases = store.filesRelatedPerformerBasesStore.getPerformerFilesBasesRelatedPerformerIdArr(id) as never[];
            return;
        }
    }
    formData.name = '';
    formData.databases = [];

}
const submitForm = async (mode: string) => {
    loading.open();
    let status = false;
    if (mode == 'add') {
        status = await performerBasesServerData.add(formData.name, formData.databases);
    } else {
        if (formDataId) {
            status = await performerBasesServerData.edit(formDataId, formData.name);
        }
    }
    if (status) {
        await store.performerBasesStore.init();
        await store.filesRelatedPerformerBasesStore.init();
        comFormRef.value?.success(t('performerDatabases.message.' + mode + 'Success'));
    } else {
        comFormRef.value?.fail(t('performerDatabases.message.' + mode + 'Fail'));
    }
    await loading.closeSync();
}
const open = (_mode: string, id: string | undefined = undefined) => {
    mode.value = _mode;
    init(id);
    comFormRef.value?.open(_mode);
}

// eslint-disable-next-line no-undef
defineExpose({ open });
</script>