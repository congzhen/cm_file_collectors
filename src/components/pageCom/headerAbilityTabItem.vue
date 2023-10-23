<template>
    <div class="headerAbilityTabItem" @click="playRes">
        <div class="photo">
            <el-image :src="getCoverSrc()" style="width: 78px; height:84px" fit="contain">
                <template #error>
                    <el-empty description=" " :image-size="30" />
                </template>
            </el-image>
        </div>
        <div class="content">
            <label>{{ props.dataInfo.title }}</label>
            <div class="details">
                <span>{{ props.dataInfo.lastPlayTime }}</span>
                <span class="hot">Hot: {{ props.dataInfo.hot }}</span>
            </div>
            <div class="performerList">
                {{ dataInfoPerformer_C }}
            </div>
            <div class="performerList">
                {{ dataInfoTag_C }}
            </div>
            <div class="performerList">
                {{ props.dataInfo.lastPlayFile }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Iresources, IresourcesBase } from '@/dataInterface/resources.interface';
import { performerStore } from "@/store/performer.store";
import { tagStore } from "@/store/tag.store";
import { computed, inject } from 'vue'
import randomPoster from "@/abilities/randomPoster";
import { resCoverImageSrc } from "@/assets/fileDbFolder";
const indexPlayResourcesDataInject = inject<(_resourcesBase: IresourcesBase) => void>('indexPlayResourcesData');
const store = {
    performerStore: performerStore(),
    tagStore: tagStore(),
}

// eslint-disable-next-line no-undef
const props = defineProps({
    dataInfo: {
        type: Object as () => Iresources,
        required: true,
    },
});
const getCoverSrc = () => {
    if (props.dataInfo.coverPoster != '') {
        return resCoverImageSrc(props.dataInfo.filesBases_id, props.dataInfo.coverPoster);
    } else {
        return randomPoster(props.dataInfo.addTime);
    }
}
const dataInfoPerformer_C = computed(() => {
    const performerNameArr: Array<string> = [];
    props.dataInfo.performers.forEach(perInfo => {
        const performerInfo = store.performerStore.getPerformerInfoById(perInfo.performer_id);
        if (performerInfo) {
            performerNameArr.push(performerInfo.name);
        }
    })
    return performerNameArr.join(',');
});

const dataInfoTag_C = computed(() => {
    const tagNameArr: Array<string> = [];
    props.dataInfo.tags.forEach(tagDict => {
        const tagInfo = store.tagStore.getTagById(tagDict.tag_id);
        if (tagInfo) {
            tagNameArr.push(tagInfo.name);
        }
    })
    return tagNameArr.join(',');
});

const playRes = async () => {
    if (indexPlayResourcesDataInject) {
        indexPlayResourcesDataInject(props.dataInfo);
    }
}

</script>
<style scoped>
.headerAbilityTabItem {
    padding: 5px 10px;
    border-radius: 5px;
    width: calc(100% - 20px);
    display: flex;
    cursor: pointer;
}

.headerAbilityTabItem:hover {
    background-color: #ECF5FF;
}

.headerAbilityTabItem .photo {
    width: 78px;
    height: 84px;
    padding: 1px;
    border: 1px solid #F5F7FA;
}

.headerAbilityTabItem .content {
    width: calc(100% - 95px);
    overflow: hidden;
}

.headerAbilityTabItem .content label {
    font-size: 12px;
    line-height: 15px;
    width: calc(100% -20px);
    padding: 0px 10px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.headerAbilityTabItem .content .details {
    display: flex;
}

.headerAbilityTabItem .content .details span {
    display: block;
    padding-left: 2px;
    padding-right: 8px;
    line-height: 21px;
    font-size: 12px;
    transform: scale(.85);
    text-align: left;
    color: #AAAEB3;
    font-family: Arial, Helvetica, sans-serif;
}

.headerAbilityTabItem .content .details .hot {
    color: #FF9494;
}

.headerAbilityTabItem .content .details .ep {
    color: #79BBFF;
}

.headerAbilityTabItem .performerList {
    color: #AAAEB3;
    line-height: 15px;
    font-size: 12px;
    transform: scale(.95);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
}
</style>