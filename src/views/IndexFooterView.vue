<template>
    <div class="footer">
        <div class="pagination">
            <el-pagination layout="total,prev, pager, next,jumper" :total="props.dataCount"
                v-model:current-page="currentPage" v-model:page-size="pageSize" :small="true"
                @current-change="currentChange" />
        </div>
        <div class="settingsEtc">
            <div class="sItem">
                <el-checkbox v-model="streamingServerStatus" :label="$t('server.videoStreamingServer')" size="large"
                    @change="changeVideoStreamingServer" />
            </div>
            <div class="sItem selectDatabase">
                <el-select v-model="currentFilesBases" @change="changeFilesBases">
                    <el-option v-for="item, key in  store.filesBasesStore.filesBasesList.filter(item => item.status) "
                        :key="key" :label="item.name" :value="item.id" />
                </el-select>
            </div>
            <div class="sItem btnI" @click="openDatabasesAdmin">
                <el-icon :size="24">
                    <Coin />
                </el-icon>
            </div>
            <div class="sItem btnI" v-if="softWareConfigData.automaticallyCreateVideoM3u8File === true"
                @click="openM3u8Builder">
                <el-icon :size="24">
                    <Film />
                </el-icon>
            </div>
            <div class="sItem btnI" @click="openBatchEdit">
                <el-icon :size="24" :color="store.baseStore.batchEditStatus ? '#FF5A5D' : ''">
                    <Edit />
                </el-icon>
            </div>
            <div class="sItem btnI" @click="openPlugIn">
                <el-icon :size="24">
                    <SetUp />
                </el-icon>
            </div>
            <div class="sItem btnI" @click="openSystem">
                <el-icon :size="24">
                    <Setting />
                </el-icon>
            </div>
        </div>
    </div>
    <systemDialog ref="systemDialogRef"></systemDialog>
    <filesDatabasesAdminDialog ref="filesDatabasesAdminDialogRef"></filesDatabasesAdminDialog>
    <m3u8BuilderDialog ref="m3u8BuilderDialogRef"></m3u8BuilderDialog>
    <batchEdit ref="batchEditRef" @fnExec="fnExec"></batchEdit>
    <plugInadminDialog ref="plugInadminDialogRef"></plugInadminDialog>
</template>
<script setup lang="ts">
import { softWareConfigData } from '@/setup/softwareConfig';
import { ElMessage } from 'element-plus'
import filesDatabasesAdminDialog from '@/components/filesDatabasesAdmin/filesDatabasesAdminDialog.vue';
import plugInadminDialog from '@/components/plugIn/plugInAdminDialog.vue';
import systemDialog from '@/components/system/systemDialog.vue';
import m3u8BuilderDialog from '@/components/m3u8Builder/m3u8BuilderDialog.vue';
import batchEdit from '@/components/pageCom/batchEdit.vue';
import { EresUpdate, footerFnType } from '@/dataInterface/common.enum';
import { filesBasesStore } from "@/store/filesBases.store";
import { baseStore } from "@/store/base.store"
import { createServer, closeServer } from '@/webServer/index.webServer';
import { ref, inject, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();


const AppInitInject = inject<(_filesBases_id: string, _callBack: () => void) => void>('AppInit');
const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');

// eslint-disable-next-line no-undef
const props = defineProps({
    dataCount: {
        type: Number,
        default: 50,
    },
    dataLimit: {
        type: Number,
        default: 32,
    }
});
// eslint-disable-next-line no-undef
const emits = defineEmits(['currentChange', 'footerFn']);
const store = {
    baseStore: baseStore(),
    filesBasesStore: filesBasesStore(),
}
const currentPage = ref(1);
const pageSize = ref(props.dataLimit);
const streamingServerStatus = ref(false);
const filesDatabasesAdminDialogRef = ref<InstanceType<typeof filesDatabasesAdminDialog>>();
const m3u8BuilderDialogRef = ref<InstanceType<typeof m3u8BuilderDialog>>();
const systemDialogRef = ref<InstanceType<typeof systemDialog>>();
const batchEditRef = ref<InstanceType<typeof batchEdit>>();
const plugInadminDialogRef = ref<InstanceType<typeof m3u8BuilderDialog>>();
const currentFilesBases = ref(store.filesBasesStore.currentFilesBases.id);

watch(() => props.dataLimit, (newValue) => pageSize.value = newValue);
watch(() => store.filesBasesStore.currentFilesBases.id, (newValue) => currentFilesBases.value = newValue);

const currentChange = () => {
    emits('currentChange', currentPage.value);
}

const setCurrentPage = (nowPage = 1) => {
    currentPage.value = nowPage;
}

const changeFilesBases = async (filesBases_id: string) => {
    if (AppInitInject) AppInitInject(filesBases_id, async () => {
        if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData, EresUpdate.updataDetailsViewByUpdateDataFirstRecord]);
    });

}

const fnExec = (fnType: footerFnType) => {
    emits('footerFn', fnType);
}

const openSystem = () => {
    systemDialogRef.value?.open();
}

const openPlugIn = () => {
    plugInadminDialogRef.value?.open();
}

const openDatabasesAdmin = () => {
    filesDatabasesAdminDialogRef.value?.open();
}
const openM3u8Builder = () => {
    m3u8BuilderDialogRef.value?.open();
}
const openBatchEdit = () => {
    batchEditRef.value?.open();
}

const changeVideoStreamingServer = async (v: boolean) => {
    if (v) {
        const { status, ip, port } = await createServer();
        ElMessage({
            showClose: true,
            message: t('server.message.' + (status ? 'createSuccess' : 'createError'), { ip, port }),
            type: status ? 'success' : 'error',
            duration: 0,
        })

    } else {
        const { ip, port } = closeServer();
        ElMessage({
            showClose: true,
            message: t('server.message.close', { ip, port }),
            type: 'warning',
            duration: 0,
        })
    }
}

onMounted(() => {
    if (softWareConfigData.autoOpenServer as boolean) {
        streamingServerStatus.value = true;
        changeVideoStreamingServer(true);
    }
})

// eslint-disable-next-line no-undef
defineExpose({ setCurrentPage });

</script>
<style scoped>
.footer {
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #606266;
    background-color: #f2f2f5;
    display: flex;
    justify-content: space-between;
}

.pagination {
    padding: 5px 0px 0px 10px;
}

.settingsEtc {
    display: flex;
}

.settingsEtc .sItem {
    padding-right: 5px;
}

.settingsEtc .selectDatabase {
    width: 200px;
    padding-top: 2px;
}

.settingsEtc .btnI {
    padding-top: 5px;
    cursor: pointer;
}

.settingsEtc .btnI:hover {
    color: #5CB6FF;
}
</style>