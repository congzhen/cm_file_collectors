<template>
    <el-tag :class="[props.tagData.status ? 'tagSectionEnable' : 'tagSectionDisable', 'tagSection']" effect="dark"
        type="warning" size="large" :disable-transitions="true" @mouseenter="onMouseoverEnvBtn"
        @mouseleave="onMouseleaveEnvBtn">
        <label>{{ props.tagData.name }}</label>
        <div v-show="toolStatus" style="position: relative;">
            <div v-if="props.tagData.status" class="tagSeniorTool">
                <el-icon :size="12" color="#282923" @click="editHandle">
                    <Edit />
                </el-icon>
                <el-icon :size="12" color="#282923" @click="deleteHandle">
                    <Delete />
                </el-icon>
            </div>
            <div v-else class="tagSeniorTool">
                <el-icon :size="12" color="#F2F6FC" @click="restoreHandle">
                    <RefreshLeft />
                </el-icon>
            </div>
        </div>
        <tagAdminSectionEdit ref="tagAdminSectionEditRef"></tagAdminSectionEdit>
    </el-tag>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import tagAdminSectionEdit from './tagAdminSectionEdit.vue';
import deleteConfirm from "@/components/common/funDeleteConfirm";
import restoreConfirm from "@/components/common/funRestoreConfirm"
import { tagServerData } from "@/serverData/tag.serverData"
import { tagStore } from '@/store/tag.store';
import { Itag } from "@/dataInterface/tag.interface"
import { ref } from 'vue'
// eslint-disable-next-line no-undef
const props = defineProps({
    tagData: {
        type: Object as () => Itag,
        required: true
    }
});
const store = {
    tagStore: tagStore(),
}

const tagAdminSectionEditRef = ref<InstanceType<typeof tagAdminSectionEdit>>();

const toolStatus = ref(false)
const onMouseoverEnvBtn = () => {
    toolStatus.value = true;
}
const onMouseleaveEnvBtn = () => {
    toolStatus.value = false;
}

const editHandle = () => {
    tagAdminSectionEditRef.value?.open(props.tagData);
}
const deleteHandle = () => {
    deleteConfirm.exec(props.tagData.name, async () => {
        loading.open();
        await tagServerData.setStatus(props.tagData.id, false);
        store.tagStore.setStatus(props.tagData.id, false);
        await loading.closeSync();
    });
}

const restoreHandle = () => {
    restoreConfirm.exec(props.tagData.name, async () => {
        loading.open();
        await tagServerData.setStatus(props.tagData.id, true);
        store.tagStore.setStatus(props.tagData.id, true);
        await loading.closeSync();
    });
}

</script>
<style scoped>
.tagSection {
    cursor: pointer;

}

.tagSectionEnable {
    background-color: #faa84a;
}

.tagSectionDisable {
    background-color: #414141;
}

.tagSection label {
    padding: 0px 8px;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.tagSeniorTool {
    padding-top: 1px;
    height: 30px;
    line-height: 12px;
    position: absolute;
    z-index: 5px;
    margin-top: -21px;
    margin-right: -16px;
    right: 2px;
    color: red;
    cursor: pointer;
}

.tagSeniorTool i {
    display: block;
    cursor: pointer;
}
</style>