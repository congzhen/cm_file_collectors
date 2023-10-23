<template>
    <div class="resourcesMain">
        <div class="left">
            <div class="coverPoster"
                v-bind:style="{ height: coverPosterHeight + 'px', lineHeight: coverPosterHeight + 'px' }">
                <el-upload action="/" :on-change="handleUploadCoverPoster" :show-file-list="false" :auto-upload="false"
                    drag>
                    <div class="photo"
                        v-bind:style="{ height: coverPosterHeight + 'px', lineHeight: coverPosterHeight + 'px' }">
                        <el-image :src="coverPosterSrc">
                            <template #error>
                                <div class="image-slot">{{ $t('resources.clickUploadCoverPoster') }}</div>
                            </template>
                        </el-image>
                    </div>
                </el-upload>
            </div>
            <div class="coverPosterMode">
                <el-radio-group v-model="formData.coverPosterMode" size="small" @change="changeCoverPosterMode">
                    <el-radio v-for="item, index in store.filesBasesSettingStore.config.coverPosterData" :key="index"
                        :label="index" border>{{ item.name }}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="right">
            <comForm ref="comFormRef" v-model="formData" :rules="formRules" :dialogForm="false" btnPosition="right"
                @submit="submitForm">
                <div class="formTitle">
                    <el-alert :title="$t('resources.form.subclass.headTitle')" type="success" :closable="false" />
                </div>
                <div ref="formBodyRef" class="formBody">
                    <el-scrollbar ref="scrollbarRef" height="100%">
                        <div class="formBlockGroup">
                            <div class="formBlock">
                                <el-form-item :label="$t('resources.form.mode')">
                                    <el-radio-group v-model="formData.mode" size="small">
                                        <el-radio-button v-for="item, key in dataset.resMode" :key="key" :label="item">
                                            {{ $t('resources.form.modeType.' + item) }}
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item :label="$t('resources.form.title.' + formData.mode)" prop="title">
                                    <el-input v-model="formData.title" />
                                </el-form-item>
                                <el-form-item :label="$t('resources.form.versionNumber')">
                                    <el-input v-model="formData.issueNumber" />
                                </el-form-item>
                                <div class="formHalving">
                                    <div class="formHalvingBlock">
                                        <el-form-item :label="$t('resources.form.issuingDate')">
                                            <el-date-picker v-model="formData.issuingDate" type="date"
                                                value-format="YYYY-MM-DD" />
                                        </el-form-item>
                                    </div>
                                    <div class="formHalvingBlock">
                                        <el-form-item :label="$t('resources.form.country')">
                                            <el-select v-model="formData.country" clearable>
                                                <el-option
                                                    v-for="item, index in store.filesBasesSettingStore.config.country"
                                                    :key="index" :label="$t('country.' + item)" :value="item" />
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="formHalving">
                                    <div class="formHalvingBlock">
                                        <el-form-item :label="$t('resources.form.definition')">
                                            <el-select v-model="formData.definition" clearable>
                                                <el-option
                                                    v-for="item, index in store.filesBasesSettingStore.config.definition"
                                                    :key="index" :label="$t('definition.' + item)" :value="item" />
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="formHalvingBlock">
                                        <el-form-item :label="$t('resources.form.stars')">
                                            <el-rate v-model="formData.stars" clearable />
                                        </el-form-item>
                                    </div>
                                </div>


                            </div>
                            <div class="formBlock">
                                <el-form-item :label="store.filesBasesSettingStore.getDirectorText">
                                    <comMultipleSearchSelect :key="keyNum" v-model="formData.directors"
                                        :dataList="store.performerStore.getPerformerListByFilesBasesId.filter(item => item.careerDirector)"
                                        :selectField="['name', 'aliasName']" :showSelectField="['name', 'aliasName']">
                                    </comMultipleSearchSelect>
                                </el-form-item>
                                <el-form-item :label="store.filesBasesSettingStore.getPerformerText">
                                    <comMultipleSearchSelect :key="keyNum" v-model="formData.performers"
                                        :dataList="store.performerStore.getPerformerListByFilesBasesId.filter(item => item.careerPerformer)"
                                        :selectField="['name', 'aliasName']" :showSelectField="['name', 'aliasName']">
                                    </comMultipleSearchSelect>
                                </el-form-item>
                                <el-form-item :label="$t('resources.form.abstract')">
                                    <el-input v-model="formData.abstract" :rows="4" type="textarea" />
                                </el-form-item>

                            </div>

                        </div>
                        <div class="formBlockGroup">
                            <div class="formBlock">
                                <div class="formTitle">
                                    <el-alert :title="$t('resources.form.subclass.movieResourcesTitle')" type="warning"
                                        :closable="false" />
                                </div>
                                <div class="dramaSeries">

                                    <div class="dramaSeriesItem"
                                        v-for="(item, key) in formData.dramaSeries.filter(item => item.type == formData.mode)"
                                        :key="key">
                                        <el-tag class="dramaSeriesNo" effect="plain" type="info"
                                            :disable-transitions="true">{{ (key + 1) }}</el-tag>
                                        <div class="dramaSeriesContent">
                                            <el-input v-model="item.src"
                                                :placeholder="item.type == EresDramaSeriesType.videoLink ? $t('resources.form.pleaseSelectLinkAddress') : $t('resources.form.pleaseSelectFileAddress')" />
                                        </div>
                                        <el-button-group>
                                            <el-button type="success" icon="FolderOpened" @click="reSelectDramaSeries(item)"
                                                v-if="item.type != EresDramaSeriesType.videoLink" />
                                            <el-button type="danger" icon="Delete" @click="deleteDramaSeries(item)" />
                                        </el-button-group>
                                    </div>
                                </div>


                                <div v-if="formData.mode == 'movies'">
                                    <el-button icon="Plus" @click="addOneMovie">{{ $t('resources.form.btn.addMovie')
                                    }}</el-button>
                                    <el-button icon="CirclePlus" @click="addMultipleMovie">{{
                                        $t('resources.form.btn.addMultipleMovie') }}</el-button>
                                </div>
                                <div v-else-if="formData.mode == 'files'">
                                    <el-button icon="CirclePlus" @click="addMultipleFiles">{{
                                        $t('resources.form.btn.addfiles') }}</el-button>
                                </div>
                                <div v-else-if="formData.mode == 'videoLink'">
                                    <el-button icon="Link" @click="addOneLink">{{
                                        $t('resources.form.btn.addVideoLink') }}</el-button>
                                </div>
                                <div v-else>
                                    <el-button icon="Plus" @click="addFolderPath(formData.mode)">{{
                                        $t('resources.form.btn.add' + formData.mode) }}</el-button>
                                </div>

                                <div class="resDragUpload" v-if="formData.mode != 'videoLink'">
                                    <el-upload action="/" :on-change="dropFileOrFolderHere" :show-file-list="false"
                                        :auto-upload="false" :multiple="true" drag>
                                        <div class="el-upload__text">
                                            {{ $t('resources.dropFileOrFolderHere') }}
                                        </div>
                                    </el-upload>
                                </div>
                            </div>
                            <div class="formBlock">
                                <div class="formTitle">
                                    <el-alert :title="$t('resources.form.subclass.tagTitle')" type="warning"
                                        :closable="false" />
                                </div>
                                <el-form-item v-for="item, index in store.tagClassStore.getTagClassListByCurrentFilesBases"
                                    :key="index" :label="item.name">
                                    <comMultipleSearchSelect :key="keyNum" v-model="formData.tags[item.id]"
                                        :dataList="store.tagStore.tagList.filter(tag => tag.tagClass_id == item.id && tag.status)">
                                    </comMultipleSearchSelect>
                                </el-form-item>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </comForm>
        </div>
    </div>
    <comCropperDialog ref="comCropperDialogRef" @sumbit="cropperSubmit"></comCropperDialog>
</template>
<script setup lang="ts">
import { ipcRendererSend } from "@/electronCommon"
import loading from '@/assets/loading'
import { coreCreateGuid } from '@/core/coreGuid'
import dataset from '@/assets/dataset';
import { saveBase64Picture, deleteFile, isVideo, getFileName } from "@/assets/file"
import comForm from '../common/comForm.vue';
import comCropperDialog from "@/components/common/comCropper.vue/comCropperDialog.vue";
import { filesBasesStore } from "@/store/filesBases.store";
import { tagStore } from "@/store/tag.store"
import { tagClassStore } from '@/store/tagClass.store';
import { performerStore } from "@/store/performer.store"
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import comMultipleSearchSelect from "@/components/common/comMultipleSearchSelect.vue"
import { resourcesServerData, EnumResExecMode } from "@/serverData/resources.serverData"
import { ref, reactive, computed, inject, nextTick } from 'vue'
import type { FormRules, UploadFile, ElScrollbar } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { IresDramaSeries, Iresources } from "@/dataInterface/resources.interface";
import { EresDramaSeriesType, EresUpdate } from "@/dataInterface/common.enum";
import { ffprobeTool } from "@/webServer/m3u8FFmpeg";
import { definitionConvert } from "@/abilities/definitionConvert";
import { resCoverFolderPath, resCoverImageSrc } from "@/assets/fileDbFolder";
const { t } = useI18n();
const indexUpdateResourcesDataInjectAdd = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const indexUpdateResourcesDataInjectEdit = inject<() => void>('indexUpdateResourcesData');
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
    performerStore: performerStore(),
    tagClassStore: tagClassStore(),
    tagStore: tagStore(),
}

// eslint-disable-next-line no-undef
const emits = defineEmits(['close']);

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const comFormRef = ref<InstanceType<typeof comForm>>();
const formBodyRef = ref<HTMLDivElement>();
const comCropperDialogRef = ref<InstanceType<typeof comCropperDialog>>();

const keyNum = ref(0);

const coverPosterSrc = ref('');
const coverPosterData = ref('');
const formData = reactive({
    id: coreCreateGuid(),
    filesBases_id: store.filesBasesStore.currentFilesBases.id,
    mode: EresDramaSeriesType.movies,
    title: '',
    issueNumber: '',
    coverPoster: '',
    coverPosterMode: 0,
    coverPosterWidth: store.filesBasesSettingStore.config.coverPosterData[0].width,
    coverPosterHeight: store.filesBasesSettingStore.config.coverPosterData[0].height,
    issuingDate: '',
    country: '',
    definition: '',
    stars: 0,
    abstract: '',
    tags: {} as { [key: string]: Array<string> },
    directors: [],
    performers: [],
    dramaSeries: [] as IresDramaSeries[],
});

const coverPosterHeight = computed(() => {
    return Math.round(300 / formData.coverPosterWidth * formData.coverPosterHeight);
});

const formRules = reactive<FormRules>({
    title: [{ required: true, trigger: 'blur', message: t('resources.form.rule.title') }],
})

const init = async (id: string | undefined = undefined, resInfo: Iresources | undefined = undefined) => {
    scrollbarRef.value?.setScrollTop(0);
    if (id == undefined && resInfo == undefined) {
        formData.id = coreCreateGuid();
        formData.filesBases_id = store.filesBasesStore.currentFilesBases.id;
        formData.mode = EresDramaSeriesType.movies;
        formData.title = '';
        formData.issueNumber = '';
        formData.coverPoster = '';
        formData.coverPosterMode = store.filesBasesSettingStore.config.coverPosterDataDefaultSelect < store.filesBasesSettingStore.config.coverPosterData.length ? store.filesBasesSettingStore.config.coverPosterDataDefaultSelect : 0;
        formData.coverPosterWidth = store.filesBasesSettingStore.config.coverPosterData[formData.coverPosterMode].width;
        formData.coverPosterHeight = store.filesBasesSettingStore.config.coverPosterData[formData.coverPosterMode].height;
        formData.issuingDate = '';
        formData.country = '';
        formData.definition = '';
        formData.stars = 0;
        formData.abstract = '';
        formData.tags = createTagsFormData();
        formData.directors = [];
        formData.performers = [];
        formData.dramaSeries = [];

        coverPosterSrc.value = '';
        coverPosterData.value = '';
    } else {
        if (resInfo == undefined) {
            if (id == undefined) return;
            resInfo = await resourcesServerData.getInfoById(id);
        }
        formData.id = resInfo.id;
        formData.filesBases_id = resInfo.filesBases_id;
        formData.mode = resInfo.mode;
        formData.title = resInfo.title;
        formData.issueNumber = resInfo.issueNumber;
        formData.coverPoster = resInfo.coverPoster;
        formData.coverPosterMode = resInfo.coverPosterMode;
        formData.coverPosterWidth = resInfo.coverPosterWidth;
        formData.coverPosterHeight = resInfo.coverPosterHeight;
        formData.issuingDate = resInfo.issuingDate;
        formData.country = resInfo.country;
        formData.definition = resInfo.definition;
        formData.stars = resInfo.stars;
        formData.abstract = resInfo.abstract;

        const _tag = createTagsFormData();
        resInfo.tags.forEach(item => {
            if (_tag[item.tagClass_id]) {
                _tag[item.tagClass_id].push(item.tag_id);
            }
        })
        formData.tags = _tag;

        formData.directors = [];
        resInfo.directors.forEach(item => {
            formData.directors.push(item.performer_id as never);
        })

        formData.performers = [];
        resInfo.performers.forEach(item => {
            formData.performers.push(item.performer_id as never);
        })

        formData.dramaSeries = resInfo.dramaSeries;

        coverPosterSrc.value = resCoverImageSrc(resInfo.filesBases_id, resInfo.coverPoster);
        coverPosterData.value = '';
    }
    //changeCoverPosterMode();
}
const createTagsFormData = () => {
    const tags: { [key: string]: Array<string> } = {};
    store.tagClassStore.getTagClassListByCurrentFilesBases.forEach((item) => {
        tags[item.id] = [];
    })
    return tags;
}

//该函数用于从新设置CoverPoster宽高，可能已经没用了
const changeCoverPosterMode = () => {
    const _coverPosterData = store.filesBasesSettingStore.config.coverPosterData[formData.coverPosterMode];
    formData.coverPosterWidth = _coverPosterData.width;
    formData.coverPosterHeight = _coverPosterData.height;
}
const handleUploadCoverPoster = (_uploadFile: UploadFile) => {
    comCropperDialogRef.value?.open(_uploadFile.raw, '70%', formData.coverPosterWidth, formData.coverPosterHeight);
}

const dropFileOrFolderHere = async (uploadFile: UploadFile) => {
    if (!uploadFile.raw || (formData.mode == EresDramaSeriesType.movies && !isVideo(uploadFile.raw.path))) {
        return;
    }
    addDramaSeries(formData.mode, uploadFile.raw.path);
    if (formData.title == '') {
        formData.title = getFileName(uploadFile.raw.path);
    }
    if (formData.mode == EresDramaSeriesType.movies && formData.definition == '') {
        const videoInfo = await ffprobeTool.getVideoInfo(uploadFile.raw.path);
        formData.definition = definitionConvert(videoInfo.height);
    }
}


const cropperSubmit = (fileData: string) => {
    coverPosterSrc.value = fileData;
    coverPosterData.value = fileData;
}

const addDramaSeries = (type: EresDramaSeriesType, src: string) => {
    formData.dramaSeries.push({
        id: coreCreateGuid(),
        resources_id: formData.id,
        type,
        src
    })
}
const reSelectDramaSeries = (obj: IresDramaSeries) => {
    let path;
    if (obj.type == 'movies' || obj.type == 'files') {
        path = ipcRendererSend.dialogGetFileSync();
    } else {
        path = ipcRendererSend.dialogGetFolderPathSync();
    }
    if (path != undefined) {
        obj.src = path;
    }
}
const deleteDramaSeries = (obj: IresDramaSeries) => {
    const index = formData.dramaSeries.findIndex(item => item.id == obj.id);
    if (index !== -1) {
        formData.dramaSeries.splice(index, 1);
    }
}

const addOneMovie = () => {
    const filePath = ipcRendererSend.dialogGetFileSync();
    if (filePath) {
        addDramaSeries(EresDramaSeriesType.movies, filePath);
    }
}
const addMultipleMovie = () => {
    const files = ipcRendererSend.dialogGetMultiSelectionsFileSync();
    files.forEach((filePath) => {
        addDramaSeries(EresDramaSeriesType.movies, filePath);
    })
}
const addFolderPath = (type: EresDramaSeriesType) => {
    const folderPath = ipcRendererSend.dialogGetFolderPathSync();
    if (folderPath) {

        addDramaSeries(type, folderPath);
    }
}
const addMultipleFiles = () => {
    const files = ipcRendererSend.dialogGetMultiSelectionsFileSync();
    files.forEach((filePath) => {
        addDramaSeries(EresDramaSeriesType.files, filePath);
    })
}

const addOneLink = () => {
    addDramaSeries(EresDramaSeriesType.videoLink, '');
}

const submitForm = async (mode: string) => {
    loading.open();
    let oldCoverPoster = formData.coverPoster;
    let status = false;
    if (coverPosterData.value != '') {
        const { fileName } = saveBase64Picture(coverPosterData.value, resCoverFolderPath(formData.filesBases_id), undefined, 'jpg');
        formData.coverPoster = fileName;
    }
    if (mode == 'add') {
        status = await resourcesServerData.exec(formData, EnumResExecMode.add);
    } else {
        status = await resourcesServerData.exec(formData, EnumResExecMode.edit);
    }
    if (status) {
        if (coverPosterData.value != '') {
            deleteFile(resCoverFolderPath(formData.filesBases_id), oldCoverPoster);
        }
        comFormRef.value?.success(t('resources.form.message.' + mode + 'Success'));
        close();
        if (mode == 'add') {
            if (indexUpdateResourcesDataInjectAdd) indexUpdateResourcesDataInjectAdd([EresUpdate.updateData]);
        } else {
            if (indexUpdateResourcesDataInjectEdit) indexUpdateResourcesDataInjectEdit();
        }
    } else {
        if (coverPosterData.value != '') {
            deleteFile(resCoverFolderPath(formData.filesBases_id), formData.coverPoster);
        }
        comFormRef.value?.fail(t('performer.form.message.' + mode + 'Fail'));
    }
    await loading.closeSync();
};

const open = async (_mode: string, id: string | undefined = undefined, resInfo: Iresources | undefined = undefined) => {
    loading.open();
    //if (_mode == 'add') {
    keyNum.value++;
    //}
    nextTick(async () => {
        init(id, resInfo);
        comFormRef.value?.open(_mode);
        await loading.closeSync();
    })
}
const close = () => {
    emits('close');
}
const showMode = (isFullscreen: boolean, height: number) => {
    nextTick(() => {
        if (formBodyRef.value) {
            if (isFullscreen) {
                formBodyRef.value.style.height = height + 'px';
            } else {
                formBodyRef.value.style.height = '460px';
            }
        }
    })
}
// eslint-disable-next-line no-undef
defineExpose({ open, showMode });

</script>
<style scoped>
.resourcesMain {
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.resourcesMain .left {
    width: 304px;
}

.resourcesMain .coverPoster {
    width: 300px;
    height: 420px;
    border: 1px solid #EBEEF5;
    border-radius: 5px;
    padding: 1px;
    overflow: hidden;
}

.resourcesMain .coverPoster :deep(.el-upload-dragger) {
    padding: 0px;
    border: 0px;
    border-radius: 0px;
}

.resourcesMain .coverPoster .image-slot {
    width: 300px;
    height: auto;
    text-align: center;
    user-select: none;
    color: #a8abb2;
    font-size: 16px;
}

.coverPosterMode .el-radio-group {
    width: calc(100% - 5px);
    margin-top: 2px;
    padding: 5px 0px 0px 5px;
    /*background-color: #F4F4F5;*/
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.coverPosterMode .el-radio-group .el-radio {
    width: calc(50% - 5px);
    margin: 0px 5px 5px 0px;
    overflow: hidden;
}

.coverPosterMode .el-radio-group .el-radio>>>.el-radio__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.resourcesMain .right {
    width: calc(100% - 315px);
    height: 100%;
    overflow: hidden;
}

.resourcesMain .right .formBody {
    height: 460px;
    padding-bottom: 10px;
}

.formTitle {
    margin-bottom: 10px;
}

.formHalving {
    width: 100%;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
}

.formHalving .formHalvingBlock {
    width: 50%;
    min-width: 250px;
}

.formBlockGroup {
    display: flex;
}

.formBlockGroup .formBlock {
    width: calc(50% - 10px);
    margin-right: 10px;
}

.formBlockGroup .formBlock>>>.el-form-item__label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    text-align: right;
}

.dramaSeries .dramaSeriesItem {
    display: flex;
    margin-bottom: 10px;
}

.dramaSeries .dramaSeriesNo {
    width: 50px;
    text-align: center;
    height: 32px;
    line-height: 32px;
}

.dramaSeries .dramaSeriesContent {
    width: calc(100% - 151px);
    padding-left: 5px;
    padding-right: 5px;
}

.resDragUpload {
    margin-top: 10px;
}

.resDragUpload :deep(.el-upload-dragger) {
    padding: 20px 0px;
}
</style>