<template>
    <div class="indexPlay">
        <playAtlas ref="playAtlasRef"></playAtlas>
        <playCommic ref="playCommicRef"></playCommic>
        <playVideoLink ref="playVideoLinkRef"></playVideoLink>
    </div>
</template>
<script setup lang="ts">
import { elShell } from "@/electronCommon"
import playAtlas from "@/components/pageCom/playAtlas.vue"
import playCommic from "@/components/pageCom/PlayComic.vue"
import playVideoLink from "@/components/pageCom/playVideoLink.vue"
import { EresDramaSeriesType } from "@/dataInterface/common.enum"
import { IresDramaSeries, Iresources } from '@/dataInterface/resources.interface';
import { resourcesServerData } from '@/serverData/resources.serverData'
import { tagServerData } from "@/serverData/tag.serverData";
import { tagClassServerData } from "@/serverData/tagClass.serverData";
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const playAtlasRef = ref<InstanceType<typeof playAtlas>>();
const playCommicRef = ref<InstanceType<typeof playCommic>>();
const playVideoLinkRef = ref<InstanceType<typeof playVideoLink>>();
const playResources = ref<Iresources>();
const playDramaSeries = ref<IresDramaSeries>();

const exec = () => {
    if (playDramaSeries.value == undefined) {
        return;
    }
    switch (playDramaSeries.value.type) {
        case EresDramaSeriesType.movies:
        case EresDramaSeriesType.files:
            elShell.execFile(playDramaSeries.value.src);
            break;
        case EresDramaSeriesType.atlas:
            playAtlasRef.value?.show(playDramaSeries.value.src, playResources.value?.title)
            break;
        case EresDramaSeriesType.comic:
            playCommicRef.value?.show(playDramaSeries.value.src, playResources.value?.title)
            break;
        case EresDramaSeriesType.videoLink:
            playVideoLinkRef.value?.show(playDramaSeries.value.src, playResources.value?.title)
            break;
    }
    updateResInfo(playDramaSeries.value.src);
}

const updateResInfo = async (lastPlayFile: string) => {
    if (playResources.value) {
        await resourcesServerData.updatePlay(playResources.value.id, lastPlayFile);
        const tagArr: Array<string> = [];
        const tagClassArr: Array<string> = [];
        playResources.value.tags.forEach(item => {
            if (!tagArr.includes(item.tag_id)) {
                tagArr.push(item.tag_id);
            }
            if (!tagClassArr.includes(item.tagClass_id)) {
                tagClassArr.push(item.tagClass_id);
            }
        })
        await tagServerData.updatePlayHot(tagArr);
        await tagClassServerData.updatePlayHot(tagClassArr);
    }
}



const play = (data: Iresources, dramaSeries: IresDramaSeries | undefined = undefined) => {
    if (dramaSeries == undefined) {
        let nowDramaSeries: IresDramaSeries | undefined = undefined;
        for (const ds of data.dramaSeries) {
            if (ds.type == data.mode) {
                nowDramaSeries = ds;
                break;
            }
        }
        if (nowDramaSeries == undefined) {
            ElMessage.error(t('play.resNoHasDramaSeries'))
            return;
        }
        playDramaSeries.value = nowDramaSeries;
    } else {
        playDramaSeries.value = dramaSeries;
    }
    playResources.value = data;
    exec();
}

// eslint-disable-next-line no-undef
defineExpose({ play });

</script>
<style scoped></style>