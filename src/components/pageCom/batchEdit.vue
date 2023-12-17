<template>
    <div ref="batchEditBodyRef" class="batchEdit" v-if="store.baseStore.batchEditStatus">
        <div class="sizeBtn" @click="show()">
            <el-icon>
                <ArrowRightBold v-if="batchEditShowStatus" />
                <ArrowLeftBold v-else />
            </el-icon>
        </div>
        <div class="title">
            {{ $t('batchEdit.pleaseSelectResource') }}
            <el-icon :size="18" @click="close">
                <CircleClose />
            </el-icon>
        </div>
        <ul class="content">
            <li v-for="data, key in store.baseStore.batchEditDataList" :key="key">{{ data.title }}</li>
        </ul>
        <div class="btn">
            <el-button-group size="small">
                <el-button @click="showDialog"> {{ $t('batchEdit.edit') }}</el-button>
                <el-button @click="submitDeleteRes"> {{ $t('batchEdit.delete') }}</el-button>
            </el-button-group>
        </div>
    </div>
    <el-dialog v-model="dialogTableVisible" :title="$t('batchEdit.batchAddTags')" :close-on-click-modal="false">
        <div style="height: 300px;">
            <comMultipleSearchSelect v-model="tagList" :dataList="store.tagStore.tagList.filter(tag => tag.status)">
            </comMultipleSearchSelect>
        </div>
        <template #footer>
            <el-button @click="dialogTableVisible = false">{{ $t('batchEdit.cancel') }}</el-button>
            <el-button type="primary" @click="submitTag">{{ $t('batchEdit.confirm') }}</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { ElMessage } from 'element-plus'
import { baseStore } from "@/store/base.store"
import { tagStore } from "@/store/tag.store"
import comMultipleSearchSelect from "@/components/common/comMultipleSearchSelect.vue"
import { ref, inject } from 'vue'
import { resourcesTagsServerData } from '@/serverData/resourcesTags.serverData'
import { resourcesServerData } from '@/serverData/resources.serverData'
import { deleteFile } from '@/assets/file'
import { resCoverFolderPath } from '@/assets/fileDbFolder'
import deleteConfirm from '../common/funDeleteConfirm'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const indexUpdateResourcesDataInject = inject<() => void>('indexUpdateResourcesData');
const store = {
    baseStore: baseStore(),
    tagStore: tagStore(),
}
const batchEditBodyRef = ref<HTMLDivElement>();
const batchEditShowStatus = ref(true);
const dialogTableVisible = ref(false);

const tagList = ref<Array<string>>([]);

const showDialog = () => {
    if (store.baseStore.batchEditDataList.length > 0) {
        dialogTableVisible.value = true;
    } else {
        ElMessage.error(t('batchEdit.pleaseSelectResource'));
    }
}

const submitTag = async () => {
    if (tagList.value.length == 0) {
        ElMessage.error(t('batchEdit.pleaseSetTagsFirst'))
        return;
    }
    try {
        loading.open();
        for (const res of store.baseStore.batchEditDataList) {
            for (const tag_id of tagList.value) {
                await resourcesTagsServerData.addResourcesTags(res.id, tag_id);
            }
        }
        dialogTableVisible.value = false;
        tagList.value = [];
        ElMessage.success(t('batchEdit.batchAddTagsSuccessfully'));
        await loading.closeSync();
    } catch (e) {
        console.log(e);
        await loading.closeSync();
    }
}

const submitDeleteRes = async () => {
    if (store.baseStore.batchEditDataList.length == 0) {
        ElMessage.error(t('batchEdit.pleaseSelectResource'));
        return;
    }
    deleteConfirm.exec(t('batchEdit.selectedResources'), async () => {
        try {
            loading.open();
            for (const resDataInfo of store.baseStore.batchEditDataList) {
                await resourcesServerData.delete(resDataInfo.id);
                if (resDataInfo.coverPoster != '') {
                    deleteFile(resCoverFolderPath(resDataInfo.filesBases_id), resDataInfo.coverPoster);
                }
            }
            ElMessage.success(t('batchEdit.batchDeleteSuccessfully'));
            close();
            await loading.closeSync();
            if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject();
        } catch (e) {
            console.log(e);
            await loading.closeSync();
        }
    });

}

const show = () => {
    batchEditShowStatus.value = !batchEditShowStatus.value;
    if (batchEditBodyRef.value) {
        if (batchEditShowStatus.value) {
            batchEditBodyRef.value.style.right = '0px';
        } else {
            batchEditBodyRef.value.style.right = '-200px';
        }
    }
}

const init = () => {
    batchEditShowStatus.value = true;
    tagList.value = [];
    store.baseStore.clearBatchEditData();
}

const open = () => {
    init();
    store.baseStore.setBatchEditStatus(!store.baseStore.batchEditStatus);
}
const close = () => {
    store.baseStore.setBatchEditStatus(false);
}

// eslint-disable-next-line no-undef
defineExpose({ open });
</script>
<style scoped lang="scss">
.batchEdit {
    width: 200px;
    height: 500px;
    padding: 5px;
    position: fixed;
    border: 1px solid #E4E7ED;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    z-index: 999;
    right: 0;
    bottom: 36px;
    background-color: #F2F2F5;

    .sizeBtn {
        width: 30px;
        height: 100px;
        margin-top: 15px;
        position: absolute;
        background-color: #606266;
    }

    .sizeBtn {
        width: 10px;
        height: 80px;
        line-height: 82px;
        overflow: hidden;
        background-color: #F2F2F5;
        color: #E4E7ED;
        position: absolute;
        margin-left: -17px;
        margin-top: 190px;
        border-top-left-radius: 7px;
        border-bottom-left-radius: 7px;
        border-top: 1px solid #E4E7ED;
        border-bottom: 1px solid #E4E7ED;
        border-left: 1px solid #E4E7ED;
        z-index: 89;
        cursor: pointer;
        transition: left 0.5s;
    }

    .sizeBtn:hover {
        background-color: #e1e1e1;
        color: #ffffff;
    }

    .title {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #E4E7ED;

        .el-icon {
            float: right;
            padding-top: 5px;
            cursor: pointer;
            color: #606266;
        }

        .el-icon :hover {
            color: #D4D7DE;
        }
    }

    .content {
        width: 100%;
        height: calc(100% - 30px - 30px);
        list-style-type: none;
        font-size: 12px;
        overflow-y: auto;
    }

    .content li {
        cursor: pointer;
        padding: 2px 5px;
    }

    .content li:hover {
        color: #000;
    }

    .btn {
        width: 100%;
        height: 27px;
        padding-top: 3px;
        text-align: center;
    }
}
</style>