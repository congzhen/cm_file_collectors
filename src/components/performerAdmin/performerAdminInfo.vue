<template>
    <div class="performerInfo">
        <div class="performerInfoBtnGroup">
            <el-button-group>
                <el-button type="success" icon="DocumentAdd" @click="addPerformer">
                    {{ $t('performer.infoBtn.add') }}
                </el-button>
                <el-button type="warning" icon="Edit" @click="editPerformer">{{ $t('performer.infoBtn.edit') }}</el-button>
                <el-button type="danger" icon="Delete" @click="deletePerformer">{{ $t('performer.infoBtn.delete')
                }}</el-button>
            </el-button-group>
        </div>
        <div class="performerInfoPhoto">
            <photoImageCom class="photo" v-if="performerInfo"
                :src="performerFaceImageSrc(performerInfo.performerBases_id, performerInfo.photo)">
            </photoImageCom>
        </div>
        <div class="performerInfoStars" v-if="performerInfo">
            <starsCom class="starsCom" :starsNumber="performerInfo.stars"></starsCom>
        </div>
        <div class="performerInfoBase">
            <div class="name" v-if="performerInfo">{{ performerInfo.name }}</div>
        </div>
        <div class="performerInfoOther" v-if="performerInfo">
            <div class="item"><span>{{ $t('performer.aliasName') }}:</span><label>{{ performerInfo.aliasName
            }}</label></div>
            <div class="item"><span>{{ $t('performer.nationality') }}:</span><label
                    v-if="performerInfo.nationality != ''">{{ $t('country.' + performerInfo.nationality)
                    }}</label>
            </div>
            <div class="item" v-if="store.filesBasesSettingStore.config.plugInUnit_Cup">
                <span>{{ $t('plugin.cup.title') }}:</span>
                <label v-if="performerInfo.cup != ''">
                    {{ performerInfo.cup }}-{{ store.filesBasesSettingStore.config.plugInUnit_Cup_Text }}
                </label>
            </div>
            <div class="item" v-if="store.filesBasesSettingStore.config.plugInUnit_Cup">
                <label>
                    <el-breadcrumb>
                        <el-breadcrumb-item>
                            <span>{{ $t('plugin.cup.bust') }}: </span><label>{{ performerInfo.bust }}</label>
                        </el-breadcrumb-item>
                        <el-breadcrumb-item>
                            <span>{{ $t('plugin.cup.waist') }}: </span><label>{{ performerInfo.waist }}</label>
                        </el-breadcrumb-item>
                        <el-breadcrumb-item>
                            <span>{{ $t('plugin.cup.hip') }}: </span><label>{{ performerInfo.hip }}</label>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </label>
            </div>
            <div class="item">
                <span>{{ $t('performer.dateOfBirth') }}:</span>
                <label v-if="performerInfo.birthday != ''">
                    {{ performerInfo.birthday }}
                    ({{ $t('performer.yearsOld', { age: calculateAge(performerInfo.birthday) }) }})
                </label>
            </div>
            <div class="item"><span>{{ $t('performer.introduction') }}:</span><label>{{ performerInfo.introduction
            }}</label></div>
        </div>
        <performerAdminAdd ref="performerAdminAddRef"></performerAdminAdd>
    </div>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import { calculateAge } from '@/assets/math'
import { performerFaceImageSrc } from "@/assets/fileDbFolder"
import deleteConfirm from "@/components/common/funDeleteConfirm"
import performerAdminAdd from "./performerAdminAdd.vue";
import starsCom from "@/components/smallCom/starsCom.vue";
import photoImageCom from '@/components/smallCom/photoImageCom.vue';
import { performerServerData } from "@/serverData/performer.serverData"
import { filesBasesStore } from '@/store/filesBases.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store'
import { filesRelatedPerformerBasesStore } from '@/store/filesRelatedPerformerBases.store';
import { performerStore } from '@/store/performer.store';
import { Iperformer } from "@/dataInterface/performer.interface";
import { ref, inject, watch } from 'vue'

const updatePerformerAdminMainData = inject<() => void>('updatePerformerAdminMainData');
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
    performerStore: performerStore(),
}


const performerInfo = ref<Iperformer | undefined>();

watch(
    [
        () => store.filesBasesStore.currentFilesBases.id,
        () => store.filesRelatedPerformerBasesStore.filesRelatedPerformerBasesList
    ],
    () => {
        performerInfo.value = store.performerStore.getPerformerListByFilesBasesId[0];
    }
);

const performerAdminAddRef = ref<InstanceType<typeof performerAdminAdd>>();

const updatePerformerInfo = () => {
    if (performerInfo.value) performerInfo.value = store.performerStore.getPerformerInfoById(performerInfo.value.id);
}

const getPerformerInfo = (id: string) => {
    performerInfo.value = store.performerStore.getPerformerInfoById(id);
}

const addPerformer = () => {
    performerAdminAddRef.value?.open('add');
}

const editPerformer = () => {
    if (performerInfo.value) {
        performerAdminAddRef.value?.open('edit', performerInfo.value.id);
    }
}

const deletePerformer = () => {
    if (performerInfo.value) {
        deleteConfirm.exec(performerInfo.value.name, async () => {
            if (performerInfo.value) {
                loading.open();
                await performerServerData.setStatus(performerInfo.value.id, false);
                store.performerStore.setStatus(performerInfo.value.id, false);
                if (updatePerformerAdminMainData) updatePerformerAdminMainData();
                performerInfo.value = undefined;
                await loading.closeSync();
            }
        });
    }
}

const setCurrentPerformerId = (id: string) => {
    getPerformerInfo(id);
}

// eslint-disable-next-line no-undef
defineExpose({ setCurrentPerformerId, updatePerformerInfo });

</script>
<style scoped>
.performerInfo {
    width: 100%;
    height: 100%;
}

.performerInfoBtnGroup .el-button-group {
    width: calc(100% - 1px);
    padding-left: 1px;
    overflow: hidden;
}

.performerInfoBtnGroup .el-button-group .el-button {
    width: 33.33333333333%;
    overflow: hidden;
}

.performerInfoPhoto {
    overflow: hidden;
    padding: 5px 0px;
}

.performerInfoPhoto .photo {
    width: 100%;
    height: 320px;
}

.performerInfoStars {
    position: relative;
}

.performerInfoStars .starsCom {
    position: absolute;
    height: 20px;
    margin-top: -35px;
}

.performerInfoBase .name {
    font-weight: bold;
    font-size: 18px;
    color: #606266;
}

.performerInfoOther .item {
    padding: 1px 0px;
    line-height: 15px;
    font-size: 12px;
}

.performerInfoOther .item span {
    font-weight: bold;
    letter-spacing: 1px;
    padding-right: 5px;
}

.performerInfoOther .item label .el-breadcrumb {
    font-size: 12px;
    font-weight: initial;
}

.performerInfoOther .item label .el-breadcrumb label {
    font-weight: initial;
}
</style>