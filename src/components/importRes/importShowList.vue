<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('import.titleShowRes')" width="800px"
        :close-on-click-modal="false" append-to-body>
        <div class="settingMainDiv">
            <el-scrollbar height="600px">
                <div class="videoInfo" v-for="item, key in dataList" :key="key">
                    <div class="imgDiv">
                        <el-image :src="getImageSrc(item)" fit="cover" />
                    </div>
                    <div class="infoDiv">
                        <div>{{ item.title }}</div>
                        <div>{{ item.issueNumber }}</div>
                        <div>{{ item.abstract }}</div>
                        <div>{{ item.year }}</div>
                        <div>{{ item.tag }}</div>
                        <div>
                            <el-tag v-for="per, pkey in item.performer" :key="pkey">{{ per.name }}</el-tag>
                        </div>
                        <div>{{ item.videoPath }}</div>
                    </div>

                </div>
            </el-scrollbar>
        </div>
        <template #footer>
            <div class="buttonGroup">
                <div>
                    <el-button @click="dialogVisible = false">{{ $t('import.cancel') }}</el-button>
                    <el-button type="primary" @click="handleAdd">{{ $t('import.submit')
                    }}</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { InofData } from '@/abilities/importNfo';
import { existsFile } from '@/assets/file';
import { ref } from 'vue';

const dataList = ref<Array<InofData>>([]);

const dialogVisible = ref(false);

const getImageSrc = (info: InofData) => {
    const src = info.folder + '\\' + info.cover;
    if (existsFile(src)) {
        return src;
    } else {
        return info.cover;
    }
}

const handleAdd = () => {
    console.log(111111);
}

const open = (_data: Array<InofData>) => {
    dataList.value = _data;
    dialogVisible.value = true;
    console.log('haha', dataList);
}

// eslint-disable-next-line no-undef
defineExpose({ open });


</script>
<style scoped>
.videoInfo {
    min-height: 150px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    margin-bottom: 20px;
}

.videoInfo .imgDiv {
    width: 100px;
    height: 100px;
}

.videoInfo .infoDiv {
    width: calc(100% - 110px);
    font-size: 12px;
}

.videoInfo .infoDiv .el-tag {
    margin: 0px 5px 5px 0px;
}
</style>