<template>
    <div :class="['performerSubB', props.performerInfo.retreatStatus ? 'retreat' : '']">
        <div class="performerCup" v-if="store.filesBasesSettingStore.config.plugInUnit_Cup && performerInfo.cup != ''">
            {{ performerInfo.cup }}-{{ store.filesBasesSettingStore.config.plugInUnit_Cup_Text }}
        </div>
        <div class="performerPhoto">
            <photoImageCom class="photo"
                :src="performerFaceImageSrc(performerInfo.performerBases_id, performerInfo.photo)">
            </photoImageCom>
        </div>
        <div class="performerInfo">
            <div class="mian_name item">{{ performerInfo.name }}</div>
            <div class="subContent">
                <div class="alias_name item" v-if="props.performerInfo.aliasName != ''">
                    {{ $t('performer.aliasName') }}: {{ performerInfo.aliasName }}
                </div>
                <div class="item" v-if="store.filesBasesSettingStore.config.plugInUnit_Cup">
                    <label>
                        <el-breadcrumb>
                            <el-breadcrumb-item v-if="performerInfo.bust != ''">
                                <span>{{ $t('plugin.cup.bust') }}: </span><label>{{ performerInfo.bust }}</label>
                            </el-breadcrumb-item>
                            <el-breadcrumb-item v-if="performerInfo.waist != ''">
                                <span>{{ $t('plugin.cup.waist') }}: </span><label>{{ performerInfo.waist }}</label>
                            </el-breadcrumb-item>
                            <el-breadcrumb-item v-if="performerInfo.hip != ''">
                                <span>{{ $t('plugin.cup.hip') }}: </span><label>{{ performerInfo.hip }}</label>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </label>
                </div>
                <div class="item" v-if="props.performerInfo.birthday != ''">
                    {{ $t('performer.dateOfBirth') }}: {{ performerInfo.birthday }}
                </div>
                <div class="item" v-if="props.performerInfo.birthday != ''">
                    {{ $t('performer.shootingAge') }}:
                    {{ $t('performer.yearsOld', { age: calculateAge(props.performerInfo.birthday, props.shootingDate) }) }}
                </div>
                <div class="item">{{ performerInfo.introduction }}</div>
            </div>
            <div class="item">
                <el-button icon="Search" size="small" round @click="showPerRes">
                    {{ $t('performer.viewingPerformerMovies', { name: performerInfo.name }) }}
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { searchStore } from '@/store/search.store'
import photoImageCom from '@/components/smallCom/photoImageCom.vue'
import { performerFaceImageSrc } from "@/assets/fileDbFolder";
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { calculateAge } from '@/assets/math'
import { Iperformer } from '@/dataInterface/performer.interface';
import { inject } from 'vue'
import { EresUpdate, EsearchLogic } from '@/dataInterface/common.enum';
const indexUpdateResourcesDataInject = inject<(_up: Array<EresUpdate>) => void>('indexUpdateResourcesData');
// eslint-disable-next-line no-undef
const props = defineProps({
    performerInfo: {
        type: Object as () => Iperformer,
        required: true
    },
    shootingDate: {
        type: String,
        default: undefined,
    },
});
const store = {
    searchStore: searchStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}

const showPerRes = () => {
    store.searchStore.setSearchData('performer', EsearchLogic.single, [props.performerInfo.id]);
    if (indexUpdateResourcesDataInject) indexUpdateResourcesDataInject([EresUpdate.updateData]);
}
</script>
<style scoped>
.performerSubB {
    display: flex;
}

.performerSubB .performerCup {
    position: absolute;
    z-index: 999;
    font-size: 16px;
    font-weight: bold;
    margin-left: 300px;
    margin-top: -8px;
    color: #F56C6C;
}

.performerSubB .performerPhoto {
    width: 110px;
    height: 140px;
    border: 1px solid #EBEEF5;
    padding: 1px;
    overflow: hidden;
}

.performerSubB .performerPhoto .photo {
    width: 100%;
    height: 100%;
}

.performerSubB .performerInfo {
    width: 225px;
    margin-left: 7px;
    font-size: 12px;
    transform: scale(.9);
}

.performerSubB .performerInfo .item {
    padding-bottom: 1px;
}

.performerSubB .performerInfo .mian_name {
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    color: #FFAA47;
}

.performerSubB .performerInfo .subContent {
    min-height: 100px;
}

.performerSubB .performerInfo .item label .el-breadcrumb {
    font-size: 12px;
    font-weight: initial;
}

.performerSubB .performerInfo .item label .el-breadcrumb label {
    font-weight: initial;
}
</style>