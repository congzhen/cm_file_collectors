<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="formTitle" width="1100px" :close-on-click-modal="false"
        append-to-body>
        <div class="performerAdd">
            <div class="left">
                <el-upload action="/" :on-change="handleUploadPhotos" :show-file-list="false" :auto-upload="false" drag>
                    <div class="photo">
                        <el-image :src="photoSrc">
                            <template #error>
                                <div class="image-slot">{{ $t('performer.form.clickUploadPhotos') }}</div>
                            </template>
                        </el-image>
                    </div>
                </el-upload>
                <!--
                <div class="updataPhotoBtn">
                    <el-button-group>
                        <el-button type="success" icon="Upload">{{ $t('performer.form.uploadPhotos') }}</el-button>
                        <el-button type="danger" icon="Delete" />
                    </el-button-group>
                </div>
                -->
            </div>
            <div class="right">
                <comForm ref="comFormRef" :dialogForm="false" :modelValue="formData" :rules="formRules" btnPosition="right"
                    @submit="submitForm">
                    <div class="blockGroup">
                        <div class="block1">
                            <el-form-item :label="$t('performer.name')" prop="name">
                                <el-input v-model="formData.name" />
                            </el-form-item>
                            <el-form-item :label="$t('performer.aliasName')">
                                <el-input v-model="formData.aliasName" type="textarea" :rows="2" />
                            </el-form-item>
                            <el-form-item :label="$t('performer.introduction')">
                                <el-input v-model="formData.introduction" type="textarea" :rows="4" />
                            </el-form-item>
                            <el-form-item :label="$t('performer.starRating')">
                                <el-rate v-model="formData.stars" clearable />
                            </el-form-item>
                            <el-form-item :label="$t('performer.retreatStatus')">
                                <el-checkbox v-model="formData.retreatStatus">{{ ' ' }}</el-checkbox>
                            </el-form-item>
                        </div>
                        <div class="block2">
                            <el-form-item :label="$t('performer.career')" prop="career">
                                <el-checkbox-group v-model="formData.career">
                                    <el-checkbox label="performer" border>{{ store.filesBasesSettingStore.getPerformerText
                                    }}</el-checkbox>
                                    <el-checkbox label="director" border>{{ store.filesBasesSettingStore.getDirectorText
                                    }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item :label="$t('performer.nationality')">
                                <el-select v-model="formData.nationality" clearable>
                                    <el-option v-for="item, index in store.filesBasesSettingStore.config.country"
                                        :key="index" :label="$t('country.' + item)" :value="item" />
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="store.filesBasesSettingStore.getPlugInUnit_Cup_Text"
                                v-if="store.filesBasesSettingStore.config.plugInUnit_Cup">
                                <el-select v-model="formData.cup" clearable>
                                    <el-option v-for="item, index in dataset.cup" :key="index"
                                        :label="item + '-' + store.filesBasesSettingStore.getPlugInUnit_Cup_Text"
                                        :value="item" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('plugin.cup.BWH')"
                                v-if="store.filesBasesSettingStore.config.plugInUnit_Cup">
                                <div class="BWH">
                                    <div class="BWH_k">
                                        <el-input v-model="formData.bust" :maxlength="3"
                                            :formatter="(value: string) => value.replace(/[^\d]/g, '')">
                                            <template #prepend>B</template>
                                        </el-input>
                                    </div>
                                    <div class="BWH_k">
                                        <el-input v-model="formData.waist" :maxlength="3"
                                            :formatter="(value: string) => value.replace(/[^\d]/g, '')">
                                            <template #prepend>W</template>
                                        </el-input>
                                    </div>
                                    <div>
                                        <el-input v-model="formData.hip" :maxlength="3"
                                            :formatter="(value: string) => value.replace(/[^\d]/g, '')">
                                            <template #prepend>H</template>
                                        </el-input>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item :label="$t('performer.dateOfBirth')">
                                <el-date-picker v-model="formData.birthday" type="date" value-format="YYYY-MM-DD" />
                            </el-form-item>

                            <el-form-item :label="$t('performer.inPerformerDatabases')" prop="performerBases_id">
                                <el-select v-model="formData.performerBases_id">
                                    <el-option v-for="item, index in performerBasesList" :key="index" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </comForm>
            </div>
            <comCropperDialog ref="comCropperDialogRef" @sumbit="cropperSubmit"></comCropperDialog>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import loading from '@/assets/loading'
import comForm from "@/components/common/comForm.vue"
import comCropperDialog from "@/components/common/comCropper.vue/comCropperDialog.vue";
import dataset from "@/assets/dataset"
import { saveBase64Picture, deleteFile, fileMove } from "@/assets/file"
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store";
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store";
import { filesBasesStore } from "@/store/filesBases.store";
import { performerBasesStore } from "@/store/performerBases.store";
import { performerStore } from "@/store/performer.store"
import { IperformerBases } from "@/dataInterface/databases.interface";
import { performerServerData } from "@/serverData/performer.serverData";
import { ref, reactive, computed, inject, nextTick } from 'vue'
import type { FormRules, UploadFile } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { Iperformer } from '@/dataInterface/performer.interface';
import { performerFaceFolderPath, performerFaceImageSrc } from '@/assets/fileDbFolder';
const { t } = useI18n();
const updatePerformerAdminMainData = inject<() => void>('updatePerformerAdminMainData');

const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
    filesRelatedPerformerBasesStore: filesRelatedPerformerBasesStore(),
    filesBasesStore: filesBasesStore(),
    performerBasesStore: performerBasesStore(),
    performerStore: performerStore(),
}

const dialogVisible = ref(false);
const photoSrc = ref('');
const photoData = ref('');
const comFormRef = ref<InstanceType<typeof comForm>>();
const comCropperDialogRef = ref<InstanceType<typeof comCropperDialog>>();
const mode = ref('add');

const formTitle = computed(() => {
    if (mode.value == 'add') {
        return t('performer.form.add', { performer: store.filesBasesSettingStore.getPerformerText, director: store.filesBasesSettingStore.getDirectorText })
    } else {
        return t('performer.form.edit', { performer: store.filesBasesSettingStore.getPerformerText, director: store.filesBasesSettingStore.getDirectorText })
    }
})

const init = async (id: string | undefined = undefined) => {
    photoData.value = '';
    if (id == undefined) {
        photoSrc.value = '';
        formData.performerBases_id = store.performerStore.currentAdminPerformerBases_id;
        formData.name = '';
        formData.aliasName = '';
        formData.nationality = '';
        formData.career = ['performer'];
        formData.careerPerformer = true;
        formData.careerDirector = false;
        formData.photo = '';
        formData.cup = '';
        formData.bust = '';
        formData.waist = '';
        formData.hip = '';
        formData.birthday = '';
        formData.introduction = '';
        formData.stars = 0;
        formData.retreatStatus = false;
    } else {
        formData_id.value = id;
        const performerInfo = await performerServerData.getInfoById(id);
        console.log(performerInfo);
        photoSrc.value = performerFaceImageSrc(performerInfo.performerBases_id, performerInfo.photo);
        formData.performerBases_id = performerInfo.performerBases_id;
        formData.name = performerInfo.name;
        formData.aliasName = performerInfo.aliasName;
        formData.nationality = performerInfo.nationality;
        formData.career = [];
        formData.careerPerformer = performerInfo.careerPerformer;
        if (performerInfo.careerPerformer) {
            formData.career.push('performer');
        }
        formData.careerDirector = performerInfo.careerDirector;
        if (performerInfo.careerDirector) {
            formData.career.push('director');
        }
        formData.photo = performerInfo.photo;
        formData.cup = performerInfo.cup;
        formData.bust = performerInfo.bust;
        formData.waist = performerInfo.waist;
        formData.hip = performerInfo.hip;
        formData.birthday = performerInfo.birthday;
        formData.introduction = performerInfo.introduction;
        formData.stars = performerInfo.stars;
        formData.retreatStatus = performerInfo.retreatStatus ? true : false;
    }
}
const formData_id = ref();
const formData = reactive({
    performerBases_id: store.filesRelatedPerformerBasesStore.getFilesMainPerformerBasesId(store.filesBasesStore.currentFilesBases.id),
    name: '',
    aliasName: '',
    nationality: '',
    career: ['performer'],
    careerPerformer: true,
    careerDirector: false,
    photo: '',
    cup: '',
    bust: '',
    waist: '',
    hip: '',
    birthday: '',
    introduction: '',
    stars: 0,
    retreatStatus: false,
})
const formRules = reactive<FormRules>({
    name: [{ required: true, trigger: 'blur', message: t('performer.form.ruleName', { performer: store.filesBasesSettingStore.getPerformerText, director: store.filesBasesSettingStore.getDirectorText }) }],
    performerBases_id: [{ required: true, trigger: 'change', message: t('performer.form.rulePerformerBases_id') }],
    career: [{ type: 'array', required: true, trigger: 'change', message: t('performer.form.ruleCareer') }],
})

const performerBasesList = computed(() => {
    const performerList: Array<IperformerBases> = [];
    const arr = store.filesRelatedPerformerBasesStore.getFilesPerformerBasesRelatedPerformerIdArr(store.filesBasesStore.currentFilesBases.id);
    arr.forEach((id) => {
        const info = store.performerBasesStore.getPerformerBasesById(id);
        if (info) {
            performerList.push(info);
        }
    })
    return performerList;
});


const handleUploadPhotos = (_uploadFile: UploadFile) => {
    comCropperDialogRef.value?.open(_uploadFile.raw, '50%');
}

const cropperSubmit = (fileData: string) => {
    photoSrc.value = fileData;
    photoData.value = fileData;
}

const submitForm = async (mode: string) => {
    loading.open();
    let oldPhoto = formData.photo;
    let status = false;
    if (photoData.value != '') {
        const { fileName } = saveBase64Picture(photoData.value, performerFaceFolderPath(formData.performerBases_id), undefined, 'jpg');
        formData.photo = fileName;
    }
    let oldPerformerInfo: Iperformer | undefined = undefined;
    if (mode == 'add') {
        status = await performerServerData.add(formData);
    } else {
        oldPerformerInfo = await performerServerData.getInfoById(formData_id.value);
        status = await performerServerData.edit(formData_id.value, formData);
    }

    if (status) {
        if (photoData.value != '') {
            deleteFile(performerFaceFolderPath(formData.performerBases_id), oldPhoto);
        } else {
            if (mode != 'add' && oldPerformerInfo && oldPerformerInfo.photo != '' && oldPerformerInfo.performerBases_id != formData.performerBases_id) {
                fileMove(
                    performerFaceImageSrc(oldPerformerInfo.performerBases_id, oldPerformerInfo.photo),
                    performerFaceImageSrc(formData.performerBases_id, oldPerformerInfo.photo),
                );
            }
        }
        await store.performerStore.init();
        if (updatePerformerAdminMainData) updatePerformerAdminMainData();
        close();
        comFormRef.value?.success(t('performer.form.message.' + mode + 'Success', { performer: store.filesBasesSettingStore.getPerformerText, director: store.filesBasesSettingStore.getDirectorText }));

    } else {
        if (photoData.value != '') {
            deleteFile(performerFaceFolderPath(formData.performerBases_id), formData.photo);
        }
        comFormRef.value?.fail(t('performer.form.message.' + mode + 'Fail', { performer: store.filesBasesSettingStore.getPerformerText, director: store.filesBasesSettingStore.getDirectorText }));
    }
    await loading.closeSync();
}

const open = (_mode: string, id: string | undefined = undefined) => {
    mode.value = _mode;
    init(id);
    dialogVisible.value = true;
    nextTick(() => {
        comFormRef.value?.open(_mode);
    })
}
const close = () => {
    dialogVisible.value = false;
}

// eslint-disable-next-line no-undef
defineExpose({ open });
</script>
<style scoped>
.performerAdd {
    width: 100%;
    display: flex;
    overflow: hidden;
}

.performerAdd .left {
    width: 274px;
}

.performerAdd :deep(.el-upload-dragger) {
    padding: 0px;
    border: 0px;
    border-radius: 0px;
}


.performerAdd .photo {
    width: 270px;
    height: 320px;
    border: 1px solid #EBEEF5;
    padding: 1px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 5px;
}


.performerAdd .photo .image-slot {
    width: 270px;
    height: 320px;
    line-height: 320px;
    text-align: center;
    user-select: none;
    color: #a8abb2;
    font-size: 16px;
}

.performerAdd .photo img {
    width: 100%;
    height: 100%;
}

.performerAdd .updataPhotoBtn {
    padding: 10px 0px;
    display: flex;
    justify-content: center;
}

.performerAdd .updataPhotoBtn .el-button-group {
    width: 100%;
}

.performerAdd .updataPhotoBtn .el-button-group .el-button--success:first-child {
    width: calc(100% - 46px);
}


.performerAdd .right {
    width: calc(100% - 274px - 30px);
}

.performerAdd .BWH {
    display: flex;
    width: 220px;
}

.performerAdd .BWH>>>input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.performerAdd .BWH .BWH_k {
    margin-right: 5px;
}

.performerAdd .BWH>>>.el-input-group__prepend {
    padding-left: 5px;
    padding-right: 5px;
}

.blockGroup {
    display: flex;
    width: 100%;
    min-height: 300px;
}

.blockGroup .block1 {
    width: calc(100% - 350px);
}

.blockGroup .block2 {
    width: 350px;
}
</style>