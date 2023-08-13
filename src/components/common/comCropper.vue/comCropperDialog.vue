<template>
    <el-dialog class="mainDialog" :top="props.top" v-model="dialogVisible" :title="$t('com.cropper.title')"
        :close-on-click-modal="false" :width="props.width" append-to-body>
        <div :style="{ height: 'calc(' + props.height + ' - 80px)' }">
            <comCropper v-if="dialogVisible" ref="comCropperRef" :cropWidth="cropWidth" :cropHeight="cropHeight" mode="50%"
                @sumbit="sumbitCropper">
            </comCropper>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import comCropper from "./comCropper.vue"
import { nextTick, ref } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
    width: {
        type: String,
        default: '960px'
    },
    height: {
        type: String,
        default: '700px'
    },
    top: {
        type: String,
        default: '15vh'
    }
});
// eslint-disable-next-line no-undef
const emits = defineEmits(['sumbit']);
const comCropperRef = ref<InstanceType<typeof comCropper>>();
const dialogVisible = ref(false)

const cropWidth = ref(270);
const cropHeight = ref(320);

const open = (raw: File | undefined = undefined, mode = '100%', _cropWidth: number | undefined = undefined, _cropHeight: number | undefined = undefined) => {
    if (_cropWidth) cropWidth.value = _cropWidth;
    if (_cropHeight) cropHeight.value = _cropHeight;
    if (dialogVisible.value == false) {
        dialogVisible.value = true;
    }
    nextTick(() => {
        comCropperRef.value?.setMode(mode);
        if (raw) {
            comCropperRef.value?.setRawFile(raw);
        }
    })

}
const close = () => {
    if (dialogVisible.value == true) {
        dialogVisible.value = false;
    }
}

const sumbitCropper = (fileData: string) => {
    emits('sumbit', fileData)
    close();
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})
</script>