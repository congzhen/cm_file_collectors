<template>
    <div class="tagAdminMain">
        <el-scrollbar height="100%">
            <tagAdminClass
                v-for="item, key in store.tagClassStore.getTagClassListByfilesBasesId(store.filesBasesStore.currentFilesBases.id)"
                :key="key" :tagClassData="item" :arrowUp="arrowUpStatus(key)" :arrowDown="arrowDownStatus(key)">
            </tagAdminClass>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import tagAdminClass from './tagAdminClass.vue';
import { filesBasesStore } from '@/store/filesBases.store';
import { tagClassStore } from "@/store/tagClass.store"
const store = {
    filesBasesStore: filesBasesStore(),
    tagClassStore: tagClassStore(),
}

const arrowUpStatus = (index: number) => {
    if (index == 0) {
        return false;
    }
    return true;
}

const arrowDownStatus = (index: number) => {
    if (index == store.tagClassStore.getTagClassListByfilesBasesId(store.filesBasesStore.currentFilesBases.id).length - 1) {
        return false;
    }
    return true;
}




</script>
<style scoped>
.tagAdminMain {
    width: 100%;
    height: 100%;
}

.tagAdminMain .tagAdminClass {
    padding-bottom: 20px;
}
</style>