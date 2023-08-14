<template>
    <div class="tagSectionAdd">
        <el-button icon="CirclePlus" v-if="!editStatus" @click="showAddTagEditor"></el-button>
        <el-input ref="tagTextInputRef" v-model="inputVal" v-else>
            <template #append><el-button icon="Edit" @click="addTagSection" /></template>
        </el-input>
    </div>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { ElMessage, ElInput } from 'element-plus'
import { tagServerData } from "@/serverData/tag.serverData"
import { tagStore } from '@/store/tag.store';
import { ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
// eslint-disable-next-line no-undef
const props = defineProps({
    tagClassId: {
        type: String,
        required: true,
    }
});
const store = {
    tagStore: tagStore(),
}
const inputVal = ref('');
const tagTextInputRef = ref<InstanceType<typeof ElInput>>();
const editStatus = ref(false);
const showAddTagEditor = () => {
    editStatus.value = true;
    if (editStatus.value) {
        nextTick(() => {
            tagTextInputRef.value?.focus();
        })
    }
}
const addTagSection = async () => {
    if (inputVal.value == '') {
        return false;
    }
    loading.open();
    const rd = await tagServerData.add(props.tagClassId, inputVal.value);
    if (rd) {
        await store.tagStore.init();
        editStatus.value = false;
        inputVal.value = '';
    } else {
        ElMessage({ message: t('tag.message.addFail'), type: 'error' })
    }
    await loading.closeSync();
}


</script>
<style scoped>
.tagSectionAdd {
    color: #606266;
}

.tagSectionAdd .el-input {
    width: 200px;
}
</style>
