<template>
    <div :class="[props.mode == 'right' ? 'indexDetails' : 'indexDetailsPopup']" v-if="resDataInfo != undefined">
        <div ref="detailsTop" class="detailsTop">
            <div class="poster">
                <el-image :src="getCoverSrc()" @load="loadImage" @error="errorImage" fit="contain">
                    <template #error>
                        <div class="image-slot">
                            <el-empty :description="$t('details.noPoster')" />
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="functionGroupBtn">
                <el-button-group>
                    <el-button type="primary" icon="VideoPlay" @click="playResources()" />
                    <el-button type="primary" icon="Folder" @click="openFolder" />
                    <el-button type="primary" icon="Edit" @click="editResources" />
                    <el-button type="primary" icon="Delete" @click="deleteResources" />
                </el-button-group>
            </div>
        </div>
        <div class="detailsBody" :style="{ height: detailsBodyHeight }">
            <el-scrollbar height="100%">
                <div class="title detailsItem">{{ resDataInfo.title }}</div>
                <div class="detailsItem">
                    <detailsDramaSeries :dataList="resDataInfo.dramaSeries" :mode="resDataInfo.mode"
                        @palyDramaSeries="palyDramaSeries"></detailsDramaSeries>
                </div>
                <div class="detailsItem detailsIntro">
                    <div v-if="resDataInfo.issueNumber != ''">
                        {{ $t('video.versionNo') }}: {{ resDataInfo.issueNumber }}
                    </div>
                    <div>
                        <el-breadcrumb separator="|">
                            <el-breadcrumb-item v-if="resDataInfo.issuingDate != ''">{{ $t('defaultTag.year') }}:
                                {{ resDataInfo.issuingDate }}</el-breadcrumb-item>
                            <el-breadcrumb-item v-if="resDataInfo.country != ''">{{ $t('defaultTag.country') }}:
                                {{ $t('country.' + resDataInfo.country) }}</el-breadcrumb-item>
                            <el-breadcrumb-item v-if="resDataInfo.definition != ''">{{ $t('defaultTag.definition') }}:
                                {{ $t('definition.' + resDataInfo.definition) }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div>{{ $t('video.includedTime') }}: {{ resDataInfo.addTime }}</div>
                    <el-rate v-if="resDataInfo.stars > 0" v-model="resDataInfo.stars" disabled />
                </div>
                <detailsPreviewImage class="detailsPreviewImage" ref="detailsPreviewImageRef" :dataInfo="resDataInfo">
                </detailsPreviewImage>
                <div class="detailsItem" v-if="resDataInfo.directors.length > 0">
                    <el-alert class="tagAlert" :title="store.filesBasesSettingStore.getDirectorText" :closable="false" />
                    <div class="performerList">
                        <performerCom mode="popover"
                            v-for="item, key in resDataInfo.directors.filter(item => store.performerStore.performerExist(item.performer_id))"
                            :key="key" :performerInfo="store.performerStore.getPerformerInfoById(item.performer_id)">
                        </performerCom>
                    </div>
                </div>
                <div class="detailsItem">
                    <el-alert class="tagAlert" :title="store.filesBasesSettingStore.getPerformerText" type="success"
                        :closable="false" />
                    <div class="performerList">
                        <performerCom mode="popover"
                            v-for="item, key in resDataInfo.performers.filter(item => store.performerStore.performerExist(item.performer_id))"
                            :key="key" :performerInfo="store.performerStore.getPerformerInfoById(item.performer_id)"
                            :shootingDate="resDataInfo.issuingDate == '' ? undefined : resDataInfo.issuingDate">
                        </performerCom>
                    </div>
                </div>
                <div class="detailsItem">
                    <el-alert class="tagAlert" :title="$t('details.tag')" type="warning" :closable="false" />
                    <div class="tagList">
                        <el-tag type="info" effect="plain" size="large"
                            v-for="item, key in resDataInfo.tags.filter(item => store.tagStore.tagExist(item.tag_id))"
                            :key="key" @click="selectTag(item)">
                            {{ store.tagStore.getTagById(item.tag_id)?.name }}
                        </el-tag>
                    </div>
                </div>
                <div class="detailsItem">
                    <el-alert class="tagAlert" :title="$t('details.abstract')" type="info" :closable="false" />
                    <p class="abstract">
                        {{ resDataInfo.abstract }}
                    </p>
                </div>
                <div style="height: 20px;"></div>
            </el-scrollbar>
        </div>
    </div>
    <resourcesDialog ref="resourcesDialogRef"></resourcesDialog>
    <indexPlayView ref="indexPlayViewRef"></indexPlayView>
</template>
<script setup lang="ts">
import { elShell } from "@/electronCommon"
import virtualRouteConverter from "@/abilities/virtualRouteConverter"
import loading from '@/assets/loading'
import deleteConfirm from "@/components/common/funDeleteConfirm"
import { deleteFile } from "@/assets/file"
import detailsPreviewImage from "@/components/pageCom/detailsPreviewImage.vue";
import detailsDramaSeries from '@/components/pageCom/detailsDramaSeries.vue';
import performerCom from "@/components/smallCom/performerCom.vue"
import resourcesDialog from "@/components/resources/resourcesDialog.vue"
import indexPlayView from "@/views/indexPlayView.vue"
import { EresDetatilsType, EsearchLogic } from "@/dataInterface/common.enum"
import { IresourcesBase, Iresources, IresDramaSeries, IresTagsInfo } from '@/dataInterface/resources.interface';
import { resourcesServerData } from "@/serverData/resources.serverData"
import { tagStore } from '@/store/tag.store';
import { performerStore } from '@/store/performer.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store'
import { searchStore } from '@/store/search.store';
import { EresUpdate } from "@/dataInterface/common.enum"
import { ElMessage } from 'element-plus'
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n';
import randomPoster from "@/abilities/randomPoster"
import { IresUpdateDetailsView } from "@/dataInterface/common.interface"
import { resCoverFolderPath, resCoverImageSrc } from "@/assets/fileDbFolder"
const { t } = useI18n()

// eslint-disable-next-line no-undef
const props = defineProps({
    mode: {
        type: String,
        default: 'right',
    }
})

const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
const store = {
    tagStore: tagStore(),
    performerStore: performerStore(),
    searchStore: searchStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
const detailsPreviewImageRef = ref<InstanceType<typeof detailsPreviewImage>>();
const resourcesDialogRef = ref<InstanceType<typeof resourcesDialog>>();
const indexPlayViewRef = ref<InstanceType<typeof indexPlayView>>();
const detailsTop = ref(null);
const detailsBodyHeight = ref('calc(100% - 460px)');
const resDataInfo = ref<Iresources>();
const loadImage = () => {
    setDetailsBodyHeight(true);
}
const errorImage = () => {
    setDetailsBodyHeight(false);
}


const getCoverSrc = () => {
    if (resDataInfo.value) {
        if (resDataInfo.value.coverPoster != '') {
            return resCoverImageSrc(resDataInfo.value.filesBases_id, resDataInfo.value.coverPoster);
        } else {
            return randomPoster(resDataInfo.value?.addTime);
        }
    } else {
        return '';
    }

}



const setDetailsBodyHeight = (status: boolean) => {
    if (status && detailsTop.value != null) {
        detailsBodyHeight.value = 'calc(100% - ' + (detailsTop.value as HTMLDivElement).clientHeight + 'px)';
    } else {
        detailsBodyHeight.value = 'calc(100% - 334px)';
    }
}

const getResDataInfo = async (id: string) => {
    return await resourcesServerData.getInfoById(id);
}

const playResources = async (dramaSeries: IresDramaSeries | undefined = undefined) => {
    if (resDataInfo.value != undefined) {
        await play(resDataInfo.value, dramaSeries);
    }
}
const palyDramaSeries = async (dramaSeriesInfo: IresDramaSeries) => {
    playResources(dramaSeriesInfo)
}
const play = async (info: Iresources, dramaSeries: IresDramaSeries | undefined = undefined) => {
    await indexPlayViewRef.value?.play(info, dramaSeries);
}


const openFolder = async () => {
    if (resDataInfo.value?.dramaSeries[0] && resDataInfo.value?.dramaSeries[0].src != '') {
        await elShell.openPath(virtualRouteConverter(resDataInfo.value.dramaSeries[0].src));
    }
}

const editResources = () => {
    if (resDataInfo.value) {
        resourcesDialogRef.value?.open('edit', undefined, resDataInfo.value);
    }
}



const show = async (type: EresDetatilsType, dataInfo: IresourcesBase) => {
    const info = await getResDataInfo(dataInfo.id);
    if (type == EresDetatilsType.show) {
        resDataInfo.value = info;
    } else if (type == EresDetatilsType.play) {
        play(info);
    }
}
const updateData = async (resUpdateDetailsView: IresUpdateDetailsView | undefined = undefined) => {
    const resId = resUpdateDetailsView ? resUpdateDetailsView.id : resDataInfo.value?.id;
    if (resId) {
        resDataInfo.value = await getResDataInfo(resId);
    } else {
        resDataInfo.value = undefined;
    }
}
const deleteResources = async () => {
    if (resDataInfo.value) {
        deleteConfirm.exec(resDataInfo.value.title, async () => {
            if (resDataInfo.value) {
                loading.open();
                if (resDataInfo.value.coverPoster != '') {
                    deleteFile(resCoverFolderPath(resDataInfo.value.filesBases_id), resDataInfo.value.coverPoster);
                }
                const rd = await resourcesServerData.delete(resDataInfo.value.id);
                if (rd) {
                    ElMessage({ message: t('resources.form.message.delSuccess', { title: resDataInfo.value.title }), type: 'success' });
                    resDataInfo.value = undefined;
                    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
                } else {
                    ElMessage({ message: t('resources.form.message.delSFail', { title: resDataInfo.value.title }), type: 'error' });
                }
                await loading.closeSync();
            }

        });
    }
}

const selectTag = (tagData: IresTagsInfo) => {
    store.searchStore.setSearchData('temporaryTag', EsearchLogic.single, [tagData.tag_id]);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}


// eslint-disable-next-line no-undef
defineExpose({ show, updateData });
</script>
<style scoped>
.indexDetails {
    width: 100%;
    height: 100%;
}

.poster .el-image {
    width: 100%;
    height: auto;
}

.functionGroupBtn .el-button-group {
    width: 100%;
    padding: 2px 0px;
}

.functionGroupBtn .el-button-group .el-button {
    width: 25%;
}

.detailsBody {
    height: calc(100% - 334px);
    overflow: hidden;
}

.detailsBody .detailsItem {
    padding-bottom: 5px;
}



.detailsBody .title {
    font-size: 14px;
    font-weight: bold;
    padding: 3px 2px;
    color: #282923;
}

.detailsBody .detailsIntro {
    font-size: 12px;
    color: #606266;
    transform: scale(.88);
    margin-left: -14px;
    line-height: 20px;
}

.detailsBody .detailsIntro .el-breadcrumb {
    font-size: 12px;
}

.detailsBody .detailsIntro .el-rate {
    height: 14px;
    line-height: 14px;
}

.tagAlert {
    padding: 8px;
}

.performerList {
    display: flex;
    flex-wrap: wrap;
    padding-top: 2px;
}

.performerList .performerCom {
    margin: 0px 2px 2px 0px;
    width: 92px;
    font-size: 14px;
}

.tagList {
    padding-top: 5px;
}

.tagList .el-tag {
    margin: 0px 4px 4px 0px;
    cursor: pointer;
}

.abstract {
    font-size: 12px;
    text-indent: 2em;
    padding: 10px;
    color: #606266;
}


.indexDetailsPopup {
    display: flex;
    justify-content: space-between;
}

.indexDetailsPopup .detailsTop {
    width: 49%;
}

.indexDetailsPopup .detailsBody {
    width: 49%;
}

.indexDetailsPopup .poster .el-image {
    width: 100%;
    height: 555px;
    overflow: hidden;
}

.indexDetailsPopup .poster .el-image :deep(img) {
    object-position: top;
}

.indexDetailsPopup .functionGroupBtn {
    display: flex;
    justify-content: center;
    align-items: center;
}

.indexDetailsPopup .functionGroupBtn .el-button-group {
    width: 240px;
}

.detailsPreviewImage {
    margin-bottom: 5px;
}
</style>