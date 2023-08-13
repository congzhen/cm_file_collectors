<template>
    <div class="cropperImageMain">
        <div class="cropperImageMainCropper">
            <vueCropper ref="cropperRef" :mode="option.mode" :img="option.img" :full="option.full"
                :maxImgSize="option.maxImgSize" :fixedNumber="option.fixedNumber" :fixed="option.fixed"
                :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox" :outputSize="option.outputSize" :outputType="option.outputType"></vueCropper>
        </div>
        <div class="cropperImageMainTool">
            <el-button-group size="small">
                <div class="selectButton">
                    <el-upload v-if="showBtn('selectPicture')" action="/" @change="uploadChange" :auto-upload="false"
                        :show-file-list="false">
                        <el-button class="selectPictureBtn" type="success">{{
                            $t('com.cropper.selectPicture')
                        }}</el-button>
                    </el-upload>
                </div>
                <el-button v-if="showBtn('zoomIn')" icon="ZoomIn" @click="cl_changeScale(0.2)">{{
                    $t('com.cropper.zoomIn')
                }}</el-button>
                <el-button v-if="showBtn('zoomOut')" icon="ZoomOut" @click="cl_changeScale(-0.2)">{{
                    $t('com.cropper.zoomOut')
                }}</el-button>
                <el-button v-if="showBtn('rotateLeft')" icon="RefreshLeft" @click="cl_rotateLeft">{{
                    $t('com.cropper.rotateLeft')
                }}</el-button>
                <el-button v-if="showBtn('rotateRight')" icon="RefreshRight" @click="cl_rotateRight">{{
                    $t('com.cropper.rotateRight')
                }}</el-button>
                <el-button v-if="showBtn('autoLeftMaxCrop')" icon="Fold" @click="cl_autoLeftSize">{{
                    $t('com.cropper.autoLeftMaxCrop')
                }}</el-button>
                <el-button v-if="showBtn('autoRightMaxCrop')" icon="Expand" @click="cl_autoRightSize">{{
                    $t('com.cropper.autoRightMaxCrop')
                }}</el-button>
                <el-button v-if="showBtn('submit')" type="primary" icon="Upload" @click="cl_upload">{{
                    $t('com.cropper.submit')
                }}</el-button>
            </el-button-group>
        </div>
    </div>
</template>
<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from "vue-cropper";
import { ref, reactive } from 'vue'
import type { UploadFile } from 'element-plus'
// eslint-disable-next-line no-undef
const props = defineProps({
    cropWidth: {
        type: Number,
        required: true
    },
    cropHeight: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        default: '100%'
    },
    btnList: {
        type: Array as () => string[],
        default: () => ["selectPicture", "zoomIn", "zoomOut", "rotateLeft", "rotateRight", "autoLeftMaxCrop", "autoRightMaxCrop", "submit"]
    }
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['sumbit']);

const cropperRef = ref<InstanceType<typeof VueCropper>>();
const returnType = ref('data');


const option = reactive({
    img: '',//裁切图片地址
    outputSize: 1,//裁切质量
    outputType: 'jpeg',//裁切格式
    info: true,//图像大侠信息
    canScale: true,//是否允许滚轮缩放
    autoCrop: true,//是否默认生成裁切图框
    autoCropWidth: props.cropWidth,//默认裁切图框宽度
    autoCropHeight: props.cropHeight,//默认裁切图框高度
    fixed: true,//是否开启截图框宽高固定比例
    fixedNumber: [1, (props.cropHeight / props.cropWidth)],//裁切框的宽高比例
    full: false,//false按原比例裁切图片，不失真
    fixedBox: true,//固定裁切框大侠，不允许改变
    canMove: false,//图片是否可以移动
    canMoveBox: true,//裁切框能否拖动
    original: false,//商城图片按照原始比例渲染
    centerBox: false,//裁切框是否被限制在图片内
    height: true,//是否按照设备的dpr,输出等比例图片vue-devtools
    infoTrue: false,//true为展示真实输出图片宽高，false展示看到截图框光
    maxImgSize: 3000,//限制图片最大宽度和高度
    enlarge: 1,//图片根据截图框输出比例倍数
    mode: props.mode//图片默认渲染方式
})
const setRawFile = (rawFile: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = ((e) => {
        if (e.target != null) {
            option.img = e.target.result as string;
        }
    })
}
const setMode = (_mode: string) => {
    if (option.mode != _mode) {
        option.mode = _mode;
    }
}


const showBtn = (btnName: string): boolean => {
    return props.btnList?.indexOf(btnName) > -1;
}

const uploadChange = async (uploadFile: UploadFile) => {
    if (uploadFile.raw) {
        const file = uploadFile.raw;
        option.img = await readAsDataURL(file);
    }
}
const readAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
    });
}

const cl_changeScale = (num: number) => {
    cropperRef.value.changeScale(num);
}
const cl_rotateLeft = () => {
    cropperRef.value.rotateLeft();
}
const cl_rotateRight = () => {
    cropperRef.value.rotateRight();
}
const auto_crop_match_img_size = () => {
    const { scale, cropW, cropH, trueWidth, trueHeight } = cropperRef.value;
    if (!scale || !cropW || !cropH || !trueWidth || !trueHeight) {
        throw new Error('Missing required properties in cropperRef');
    }
    const imgW = trueWidth * scale;
    const imgH = trueHeight * scale;
    const dw = imgW - cropW;
    const dh = imgH - cropH;
    const scaleThreshold = 0.02;
    const minSize = 0.1;
    if (dw >= 0 && dh >= 0 && (dw < scaleThreshold || dh < scaleThreshold || Math.abs(dw - dh) < scaleThreshold)) {
        return;
    } else if (dw < 0 || dh < 0) {
        const sz = Math.max(dw, dh) / 100;
        const newScale = Math.max(scale + sz, minSize);
        cl_changeScale(newScale - scale);
        auto_crop_match_img_size();
    } else if (dw > 0 || dh > 0) {
        const sz = Math.min(dw, dh) / 100;
        const newScale = Math.max(scale - sz, minSize);
        cl_changeScale(newScale - scale);
        auto_crop_match_img_size();
    }
}
const cl_autoLeftSize = () => {
    auto_crop_match_img_size();
    const imgAxis = cropperRef.value.getImgAxis();
    cropperRef.value.cropOffsertX = imgAxis.x1;
    cropperRef.value.cropOffsertY = imgAxis.y1;
}

const cl_autoRightSize = () => {
    auto_crop_match_img_size();
    const imgAxis = cropperRef.value.getImgAxis();
    const cropAxis = cropperRef.value.getCropAxis();
    cropperRef.value.cropOffsertX = imgAxis.x2 - (cropAxis.x2 - cropAxis.x1);
    cropperRef.value.cropOffsertY = imgAxis.y1;
}
const cl_upload = () => {
    if (returnType.value == 'data') {
        cropperRef.value.getCropData((data: string) => {
            emits('sumbit', data)
        });
    } else if (returnType.value == 'blob') {
        cropperRef.value.getCropBlob((data: string) => {
            emits('sumbit', data)
        });
    }
}

// eslint-disable-next-line no-undef
defineExpose({ setRawFile, setMode });

</script>
<style scoped>
.cropperImageMain {
    width: 100%;
    height: 100%;
}

.cropperImageMain .cropperImageMainCropper {
    height: calc(100% - 36px);
    border: 1px solid #EBEEF5;
    padding: 1px;
}

.cropperImageMainTool {
    width: 100%;
    height: 28px;
    padding-top: 4px;
    display: flex;
    justify-content: center;
}

.cropperImageMainTool .el-button-group {
    display: flex;
}

.cropperImageMainTool .selectButton {
    line-height: 0px;
}
</style>