<template>
    <div>
        <photoImageCom class="photo" :src="src"></photoImageCom>
        <div class="name">{{ name }}</div>
        <div v-if="props.mode == 'brief'">
            <div class="perInfoOther">
                <label v-if="props.performerInfo && props.performerInfo.nationality != ''">{{ $t('country.' +
                    props.performerInfo?.nationality) }}</label>
                <span v-if="props.performerInfo && props.performerInfo.birthday != ''">({{
                    $t('performer.yearsOld', { age: calculateAge(props.performerInfo.birthday) }) }})</span>
            </div>
            <div class="perTheVideo" @click="showPerRes">
                <el-icon>
                    <VideoCameraFilled />
                </el-icon>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import photoImageCom from '@/components/smallCom/photoImageCom.vue'
import { calculateAge } from '@/assets/math'
import { Iperformer } from '@/dataInterface/performer.interface';
import { computed } from 'vue';
import { performerFaceImageSrc } from "@/assets/fileDbFolder";
// eslint-disable-next-line no-undef
const props = defineProps({
    performerInfo: {
        type: Object as () => Iperformer
    },
    mode: {
        type: String,
        default: 'simple',//['simple','brief']
    },
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['showPerRes']);

const name = computed(() => {
    if (props.performerInfo != undefined) {
        return props.performerInfo.name;
    }
    return '';
})
const src = computed(() => {
    if (props.performerInfo != undefined && props.performerInfo.photo != '') {
        return performerFaceImageSrc(props.performerInfo.performerBases_id, props.performerInfo.photo);
    }
    return '';
})

const showPerRes = () => {
    emits('showPerRes');
}
</script>
<style scoped>
.performerCom .photo {
    cursor: pointer;
    margin-left: 2px;
    margin-top: 2px;
    width: calc(100% - 8px);
    height: 0;
    padding-bottom: calc(100% - 8px);
    overflow: hidden;
    border-radius: 50px;
    border: 2px solid #FFFFFF;
}


.photo>>>.el-image {
    height: initial;
}


.performerCom .name {
    color: #606266;
    padding: 2px 5px;
    text-align: center;
    transform: scale(.75);
    overflow: hidden;
    /*溢出的部分隐藏*/
    white-space: nowrap;
    /*文本不换行*/
    text-overflow: ellipsis;
    /*ellipsis:文本溢出显示省略号（...）*/
}

.performerCom .perInfoOther {
    height: 20px;
    color: #606266;
    padding: 0px 5px;
    text-align: center;
    transform: scale(.65);
    overflow: hidden;
}

.performerCom .perTheVideo {
    position: relative;
    height: 0px;
}

.performerCom .perTheVideo i {
    position: absolute;
    margin-top: -18px;
    margin-left: 2px;
    font-size: 16px;
    cursor: pointer;
}

.performerCom .perTheVideo i {
    color: #7d7e81;
}

.performerCom .perTheVideo i:hover {
    color: #409EFF;
}
</style>