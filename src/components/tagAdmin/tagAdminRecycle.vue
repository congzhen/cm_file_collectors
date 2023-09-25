<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('tag.recycle')" width="900px"
        :close-on-click-modal="false" append-to-body>
        <el-table :data="dataList" height="500px" size="small" :border="true" :show-header="false" style="width: 100%">
            <el-table-column prop="id" width="160" :show-overflow-tooltip="true" />
            <el-table-column prop="name" width="180" :show-overflow-tooltip="true" />
            <el-table-column prop="tagClass" :show-overflow-tooltip="true">
                <template #default="scope">
                    {{ getTagClassName(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column width="160">
                <template #default="scope">
                    <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row)">{{
                        $t('tag.infoBtn.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { filesBasesStore } from '@/store/filesBases.store';
import { tagStore } from '@/store/tag.store';
import { tagClassStore } from '@/store/tagClass.store';
import deleteConfirm from "@/components/common/funDeleteConfirm"
import { Itag } from '@/dataInterface/tag.interface';
import { tagServerData } from '@/serverData/tag.serverData';
import { ref, computed } from 'vue'

const store = {
    filesBasesStore: filesBasesStore(),
    tagStore: tagStore(),
    tagClassStore: tagClassStore(),
}
const dialogVisible = ref(false);

const dataList = computed(() => {
    const tagClassIdArr = store.tagClassStore.getTagClassListByfilesBasesId(store.filesBasesStore.currentFilesBases.id, 'ALL').map(obj => obj.id);
    return store.tagStore.tagList.filter(obj => !obj.status && tagClassIdArr.includes(obj.tagClass_id));
})
const getTagClassName = (tagObj: Itag) => {
    const tagClass = store.tagClassStore.getTagClassById(tagObj.tagClass_id);
    if (tagClass) {
        return tagClass.name;
    }
    return '';
}

const handleDelete = (tag: Itag) => {
    deleteConfirm.exec(tag.name, async () => {
        loading.open();
        const rd = await tagServerData.delete(tag.id);
        if (rd) {
            store.tagStore.delete(tag.id);
        }
        await loading.closeSync();
    });
};

const open = () => {
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped></style>