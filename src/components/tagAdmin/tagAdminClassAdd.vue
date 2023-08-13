<template>
    <comForm ref="comFormRef" :formTitle="formTitle" :modelValue="formData" :rules="formRules" labelPosition="top"
        @submit="submitForm">
        <el-form-item :label="$t('tag.formClass.name')" prop="name">
            <el-input v-model="formData.name" />
        </el-form-item>
    </comForm>
</template>
<script setup lang="ts">
import comForm from "@/components/common/comForm.vue"
import loading from '@/assets/loading'
import { tagClassServerData } from "@/serverData/tagClass.serverData"
import { tagClassStore } from "@/store/tagClass.store";
import { filesBasesStore } from "@/store/filesBases.store";
import { reactive, ref, computed } from 'vue'
import type { FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    tagClassStore: tagClassStore(),
}
let formDataId: string | undefined = undefined;
const formData = reactive({
    name: '',
})
const formRules = reactive<FormRules>({
    name: [{ required: true, trigger: 'blur', message: t('tag.formClass.ruleName') }],
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
        const tagClassInfo = store.tagClassStore.getTagClassById(id);
        if (tagClassInfo) {
            formData.name = tagClassInfo.name;
            return;
        }
    }
    formData.name = '';
}
const submitForm = async (mode: string) => {
    loading.open();
    const currentFilesBases_id = store.filesBasesStore.currentFilesBases.id;
    let status = false;
    if (mode == 'add') {
        status = await tagClassServerData.add(currentFilesBases_id, formData.name);
    } else {
        if (formDataId) {
            status = await tagClassServerData.edit(formDataId, formData.name);
        }
    }
    if (status) {
        await store.tagClassStore.init();
        comFormRef.value?.success(t('tag.messageClass.' + mode + 'Success'));
    } else {
        comFormRef.value?.fail(t('tag.messageClass.' + mode + 'Fail'));
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