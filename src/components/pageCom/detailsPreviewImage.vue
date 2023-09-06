<template>
    <div class="detailsPreviewImage" v-if="previewImageList.length > 0">
        <div class="imageList">
            <div class="imageBlock" v-for="imageObj, key in previewImageList" :key="key">
                <el-image :src="imageObj.src" fit="cover" :initial-index="key" :preview-src-list="previewImageSrc_C" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import virtualRouteConverter from "@/abilities/virtualRouteConverter"
import { existsFile, getFolderPath, readDirImage, EfileImageInfo } from '@/assets/file';
import { EresDramaSeriesType } from '@/dataInterface/common.enum';
import { Iresources } from '@/dataInterface/resources.interface';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { watch, ref, computed, onMounted } from 'vue';
// eslint-disable-next-line no-undef
const props = defineProps({
    dataInfo: {
        type: Object as () => Iresources,
        required: true,
    },
})
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
};

const previewImageList = ref<Array<EfileImageInfo>>([]);

const previewImageSrc_C = computed(() => {
    return previewImageList.value.map((item) => item.src);
})

watch(() => props.dataInfo, async (newVal) => {
    previewImageList.value = await getImageList(newVal);
});


const getImageList = async (_dataInfo: Iresources) => {
    let imageList: Array<EfileImageInfo> = [];
    if (
        !store.filesBasesSettingStore.config.showPreviewImage
        ||
        store.filesBasesSettingStore.config.previewImageFolder == ''
        ||
        _dataInfo.mode != EresDramaSeriesType.movies
        ||
        _dataInfo.dramaSeries.length == 0
        ||
        !_dataInfo.dramaSeries.some(item => item.type == EresDramaSeriesType.movies)
    ) {
        return imageList;
    }
    const resFilePath = virtualRouteConverter(_dataInfo.dramaSeries.find(item => item.type == EresDramaSeriesType.movies)!.src);
    if (!existsFile(resFilePath)) {
        return imageList
    }
    const resFolderPath = getFolderPath(resFilePath);
    const folderPathList = store.filesBasesSettingStore.config.previewImageFolder.split(',').map(item => resFolderPath + '/' + item);

    for (const path of folderPathList) {
        imageList = imageList.concat(await readDirImage(path));
    }
    return imageList;
}

onMounted(async () => {
    previewImageList.value = await getImageList(props.dataInfo);
})

</script>
<style scoped>
.detailsPreviewImage {
    width: 100%;
    display: flex;
}

.detailsPreviewImage .imageList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
}

.detailsPreviewImage .imageList .imageBlock {
    width: 63px;
    height: 80px;
    padding: 1px;
    border: 1px solid #D4D7DE;
    margin: 0 2px;
    overflow: hidden;
    cursor: pointer;
}

.detailsPreviewImage .imageList .imageBlock .el-image {
    width: 100%;
    height: 100%;
}
</style>