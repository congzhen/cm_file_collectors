<template>
    <div class="header">
        <div class="btnList">
            <el-button type="primary" @click="openResources">{{ $t('column.add') }}</el-button>
            <el-button type="primary" @click="openTagAdmin">{{ $t('column.tag') }}</el-button>
            <el-button type="primary" @click="openPerformerAdmin">
                {{ store.filesBasesSettingStore.getPerformerText }}
            </el-button>
            <el-dropdown>
                <el-button type="primary">
                    {{ $t('column.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="openImportNfoRes">{{ $t('import.mode.nfo') }}</el-dropdown-item>
                        <el-dropdown-item @click="openImportSimpleRes">{{ $t('import.mode.simple') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button type="primary" @click="openSettings">{{ $t('column.setUp') }}</el-button>
        </div>
        <div class="searchTool">
            <div class="searchToolItem abilityDiv">
                <headerAbility></headerAbility>
            </div>
            <div class="searchToolItem inputDiv">
                <el-input :placeholder="$t('headers.selectInputPlaceholder')" v-model="searchText"
                    @keyup.enter="clickSearch">
                    <template #append>
                        <el-button icon="Search" @click="clickSearch" />
                    </template>
                </el-input>
            </div>
            <div class="searchToolItem">
                <el-button type="success" @click="clickReset">{{ $t('headers.reset') }}</el-button>
            </div>
        </div>
        <div>
            <headerSearchShowTag></headerSearchShowTag>
        </div>
        <resourcesDialog ref="resourcesDialogRef"></resourcesDialog>
        <tagAdminDialog ref="tagAdminDialogRef"></tagAdminDialog>
        <performerAdminDialog ref="performerAdminDialogRef"></performerAdminDialog>
        <settingsDialog ref="settingsDialogRef"></settingsDialog>
        <importNfoDialog ref="importNfoDialogRef"></importNfoDialog>
        <importSimpleDialog ref="importSimpleDialogRef"></importSimpleDialog>
    </div>
</template>
<script setup lang="ts">
import headerAbility from "@/components/pageCom/headerAbility.vue"
import headerSearchShowTag from "@/components/pageCom/headerSearchShowTag.vue"
import resourcesDialog from "@/components/resources/resourcesDialog.vue"
import tagAdminDialog from "@/components/tagAdmin/tagAdminDialog.vue";
import performerAdminDialog from "@/components/performerAdmin/performerAdminDialog.vue";
import settingsDialog from "@/components/settings/settingsDialog.vue";
import importNfoDialog from "@/components/importRes/nfo/importDialog.vue"
import importSimpleDialog from "@/components/importRes/simple/importDialog.vue";
import { searchStore } from '@/store/search.store'
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store'
import { ref, inject } from "vue";
import { EresUpdate } from "@/dataInterface/common.enum";

const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const store = {
    searchStore: searchStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}

const resourcesDialogRef = ref<InstanceType<typeof resourcesDialog>>();
const tagAdminDialogRef = ref<InstanceType<typeof tagAdminDialog>>();
const performerAdminDialogRef = ref<InstanceType<typeof performerAdminDialog>>();
const settingsDialogRef = ref<InstanceType<typeof settingsDialog>>();
const importNfoDialogRef = ref<InstanceType<typeof importNfoDialog>>();
const importSimpleDialogRef = ref<InstanceType<typeof importSimpleDialog>>();
const searchText = ref('');

const clickSearch = () => {
    store.searchStore.setSearchText(searchText.value);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}
const clickReset = () => {
    searchText.value = '';
    store.searchStore.searchConditionInit();
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}

const openResources = () => {
    resourcesDialogRef.value?.open('add');
}
const openPerformerAdmin = () => {
    performerAdminDialogRef.value?.open();
}
const openTagAdmin = () => {
    tagAdminDialogRef.value?.open();
}
const openSettings = () => {
    settingsDialogRef.value?.open();
}
const openImportNfoRes = () => {
    importNfoDialogRef.value?.open();
}
const openImportSimpleRes = () => {
    importSimpleDialogRef.value?.open();
}
</script>
<style scoped>
.header {
    width: 100%;
    height: 40px;
    padding: 5px 0px;
    display: flex;
}

.btnList {
    padding-left: 5px;
    display: flex;
}

.btnList .el-dropdown {
    margin: 0 3px;
}

.btnList .el-button+.el-button {
    margin-left: 3px;
}

.searchTool {
    display: flex;
    padding-left: 10px;
}

.searchTool .searchToolItem {
    padding-left: 5px;
}

.searchTool .abilityDiv {
    padding-top: 5px;
}

.searchTool .inputDiv {
    width: 340px;
}
</style>
