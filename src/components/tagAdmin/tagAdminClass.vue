<template>
    <div :class="[props.tagClassData.status ? 'tagAdminClassEnable' : 'tagAdminClassDisable', 'tagAdminClass']">
        <div class="header">
            <div class="header-title">{{ props.tagClassData.name }}</div>
            <div class="header-btn-group">
                <div class="btnItem">
                    <el-button-group size="small">
                        <el-button icon="ArrowUpBold" @click="sortHandle('up')" :disabled="!props.arrowUp" />
                        <el-button icon="ArrowDownBold" @click="sortHandle('down')" :disabled="!props.arrowDown" />
                    </el-button-group>
                </div>
                <div class="btnItem">
                    <el-checkbox v-model="leftShow" :label="$t('tag.leftColumnDisplay')" />
                </div>
                <div class="btnItem">
                    <el-button-group size="small">
                        <el-button type="primary" icon="Edit" @click="editHandle" />
                        <el-button type="primary" icon="Delete" @click="deleteHandle" v-if="props.tagClassData.status" />
                        <el-button type="primary" icon="RefreshLeft" @click="restoreHandle" v-else />
                    </el-button-group>
                </div>
            </div>
        </div>
        <div class="body">
            <draggable :list="tagListByTagClassIdArr" item-key="id" @change="changeSectionList">
                <template #item="{ element, index }">
                    <tagAdminSection :tagData="element" :key="index"></tagAdminSection>
                </template>
            </draggable>
            <tagAdminSectionAdd :tagClassId="props.tagClassData.id"></tagAdminSectionAdd>
        </div>
        <tagAdminClassAdd ref="tagAdminClassAddRef"></tagAdminClassAdd>
    </div>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import tagAdminClassAdd from "./tagAdminClassAdd.vue";
import tagAdminSection from "./tagAdminSection.vue"
import tagAdminSectionAdd from "./tagAdminSectionAdd.vue"
import deleteConfirm from "@/components/common/funDeleteConfirm"
import restoreConfirm from "@/components/common/funRestoreConfirm"
import draggable from 'vuedraggable';
import { tagServerData } from "@/serverData/tag.serverData"
import { Itag, ItagClass } from "@/dataInterface/tag.interface";
import { tagClassServerData } from '@/serverData/tagClass.serverData';
import { tagClassStore } from '@/store/tagClass.store';
import { tagStore } from '@/store/tag.store';
import { filesBasesStore } from '@/store/filesBases.store';
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const store = {
    tagClassStore: tagClassStore(),
    filesBasesStore: filesBasesStore(),
    tagStore: tagStore(),
}
// eslint-disable-next-line no-undef
const props = defineProps({
    tagClassData: {
        type: Object as () => ItagClass,
        required: true,
    },
    arrowUp: {
        type: Boolean,
        default: false,
    },
    arrowDown: {
        type: Boolean,
        default: false,
    }
});

const leftShow = computed({
    get: () => props.tagClassData.leftShow ? true : false,
    set: (value) => setLeftShow(props.tagClassData.id, value),
})

const tagListByTagClassIdArr = computed({
    get: () => store.tagStore.getTagListByTagClassId(props.tagClassData.id, 'ALL'),
    set: (value) => console.log(value),
})

const setLeftShow = async (id: string, value: boolean) => {
    loading.open();
    await tagClassServerData.setLeftShow(id, value);
    store.tagClassStore.setLeftShow(id, value);
    await loading.closeSync();
}

const tagAdminClassAddRef = ref<InstanceType<typeof tagAdminClassAdd>>();

const changeSectionList = async () => {
    loading.open();
    await tagServerData.sort(tagListByTagClassIdArr.value);
    await store.tagStore.init();
    await loading.closeSync();
}

const sortHandle = async (type: string) => {
    if (type == 'down' && props.arrowDown == false) {
        return;
    } else if (type == 'up' && props.arrowUp == false) {
        return;
    }
    loading.open();
    await tagClassServerData.sort(store.filesBasesStore.currentFilesBases.id, props.tagClassData.id, type);
    await store.tagClassStore.init();
    await loading.closeSync();
}

const editHandle = () => {
    tagAdminClassAddRef.value?.open('edit', props.tagClassData.id);
}
const deleteHandle = () => {
    deleteConfirm.exec(props.tagClassData.name, async () => {
        loading.open();
        await tagClassServerData.setStatus(props.tagClassData.id, false);
        store.tagClassStore.setStatus(props.tagClassData.id, false);
        await loading.closeSync();
    });
}

const restoreHandle = () => {
    restoreConfirm.exec(props.tagClassData.name, async () => {
        loading.open();
        await tagClassServerData.setStatus(props.tagClassData.id, true);
        store.tagClassStore.setStatus(props.tagClassData.id, true);
        await loading.closeSync();
    });
}

</script>
<style scoped>
.tagAdminClassDisable {
    opacity: 0.5;
    background-color: dimgray;
    border-radius: 5px;
}

.tagAdminClassDisable .header-title {
    color: aliceblue;
}

.tagAdminClass .header {
    height: 37px;
    padding: 2px 5px;
    border-bottom: 1px solid #E4E7ED;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
}

.tagAdminClass .header-title {
    line-height: 37px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.tagAdminClass .header-btn-group {
    display: flex;
}

.btnItem {
    margin-left: 10px;
}

.btnItem .el-checkbox {
    margin-top: 2px;
}

.btnItem .el-button-group {
    margin-top: 5px;
}

.body {
    padding: 5px;
    display: flex;
}

.body .tagSection {
    margin: 0px 5px 5px 0px;
}
</style>