<template>
    <comForm ref="comFormRef" :formTitle="formTitle" :modelValue="formData" :rules="formRules" dialogWidth="600px"
        labelWidth="160px" @submit="submitForm">
        <el-form-item :label="$t('filesDatabases.name')" prop="name">
            <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="$t('filesDatabases.mainPerformerDatabase')" prop="mainPerformerDatabase">
            <el-select v-model="formData.mainPerformerDatabase" @change="changeMainPerformerDatabase">
                <el-option v-for="item, key in store.performerBasesStore.performerBasesList" :key="key" :label="item.name"
                    :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('filesDatabases.relatedPerformerDatabase')">
            <el-checkbox-group v-model="formData.relatedPerformerDatabase">
                <el-checkbox v-for="item, key in store.performerBasesStore.performerBasesList" :key="key" :label="item.id"
                    :disabled="disabledCheckbox(item.id)">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </comForm>
</template>
<script setup lang="ts">
import comForm from "@/components/common/comForm.vue"
import loading from '@/assets/loading'
import { filesBasesStore } from "@/store/filesBases.store";
import { performerBasesStore } from "@/store/performerBases.store"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store"
import { filesBasesServerData } from "@/serverData/filesBases.serverData"
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
    mainPerformerDatabase: '',
    relatedPerformerDatabase: [],
})
const formRules = reactive<FormRules>({
    name: [{ required: true, trigger: 'blur', message: t('filesDatabases.ruleName') }],
    mainPerformerDatabase: [{ required: true, trigger: 'blur', message: t('filesDatabases.ruleMainPerformerDatabase') }],
})
const comFormRef = ref<InstanceType<typeof comForm>>();
const mode = ref('add');
const formTitle = computed(() => {
    if (mode.value == 'add') {
        return t('filesDatabases.add')
    } else {
        return t('filesDatabases.edit')
    }
})
const init = (id: string | undefined = undefined) => {
    formDataId = id;
    if (id) {
        const filesInfo = store.filesBasesStore.getFilesBasesById(id);
        if (filesInfo) {
            formData.name = filesInfo.name;
            const mainPerformerBases = store.filesRelatedPerformerBasesStore.getFilesMainPerformerBasesId(id);
            formData.mainPerformerDatabase = mainPerformerBases ? mainPerformerBases : '';
            formData.relatedPerformerDatabase = store.filesRelatedPerformerBasesStore.getFilesPerformerBasesRelatedPerformerIdArr(id) as never[];
            return;
        }
    }
    formData.name = '';
    formData.mainPerformerDatabase = '';
    formData.relatedPerformerDatabase = [];

}
const changeMainPerformerDatabase = (val: never) => {
    if (!formData.relatedPerformerDatabase.includes(val)) {
        formData.relatedPerformerDatabase.push(val);
    }
}
const disabledCheckbox = (val: string): boolean => {
    if (formData.mainPerformerDatabase == val) {
        return true;
    }
    return false;
}
const submitForm = async (mode: string) => {
    loading.open();
    let status = false;
    if (mode == 'add') {
        status = await filesBasesServerData.add(formData.name, formData.mainPerformerDatabase, formData.relatedPerformerDatabase);
    } else {
        if (formDataId) {
            status = await filesBasesServerData.edit(formDataId, formData.name, formData.mainPerformerDatabase, formData.relatedPerformerDatabase);
        }
    }
    if (status) {
        await store.filesBasesStore.init();
        await store.filesRelatedPerformerBasesStore.init();
        comFormRef.value?.success(t('filesDatabases.message.' + mode + 'Success'));
    } else {
        comFormRef.value?.fail(t('filesDatabases.message.' + mode + 'Fail'));
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