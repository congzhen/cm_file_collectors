<template>
    <comForm ref="comFormRef" :formTitle="$t('tag.editTag')" :modelValue="formData" :rules="formRules" @submit="submit">
        <el-form-item :label="$t('tag.formTag.name')" prop="name">
            <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="$t('tag.formTag.class')" prop="tagClassId">
            <el-select v-model="formData.tagClassId">
                <el-option
                    v-for="item, key in store.tagClassStore.getTagClassListByfilesBasesId(store.filesBasesStore.currentFilesBases.id)"
                    :key="key" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
    </comForm>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import comForm from "@/components/common/comForm.vue"
import { filesBasesStore } from "@/store/filesBases.store"
import { tagClassStore } from "@/store/tagClass.store"
import { tagStore } from '@/store/tag.store'
import { Itag } from "@/dataInterface/tag.interface"
import { tagServerData } from "@/serverData/tag.serverData"
import { reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const store = {
    filesBasesStore: filesBasesStore(),
    tagClassStore: tagClassStore(),
    tagStore: tagStore(),
}

const comFormRef = ref<InstanceType<typeof comForm>>();

const formData = reactive({
    id: '',
    name: '',
    tagClassId: '',
})
const formRules = reactive<FormRules>({
    name: [{ required: true, trigger: 'blur', message: t('tag.formTag.ruleName') }],
    tagClassId: [{ required: true, trigger: 'blur', message: t('tag.formTag.ruleClass') }],
})

const open = (tagData: Itag) => {
    comFormRef.value?.open('edit');
    formData.id = tagData.id;
    formData.name = tagData.name;
    formData.tagClassId = tagData.tagClass_id;
}

const submit = async (_mode: string) => {
    if (_mode == 'edit') {
        loading.open();
        const rd = await tagServerData.edit(formData.id, formData.name, formData.tagClassId);
        if (rd) {
            store.tagStore.edit(formData.id, formData.name, formData.tagClassId);
            comFormRef.value?.success(t('tag.message.editSuccess'));
        } else {
            comFormRef.value?.fail(t('tag.message.editFail'));
        }
        await loading.closeSync();
    }
}

// eslint-disable-next-line no-undef
defineExpose({ open });
</script>