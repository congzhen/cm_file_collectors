<template>
    <div class="dataListTableModeMain">
        <el-table ref="dataListTableRef" :data="props.dataList" height="100%" style="width: 100%" size="small"
            @row-click="clickHandle" border>
            <el-table-column label="-" width="40">
                <template #default="scope">
                    <div class="playDiv" v-if="scope.row.coverPoster != ''"
                        @click.stop="clickPlayHandle(EresDetatilsType.play, scope.row)">
                        <el-popover placement="right-start" trigger="hover"
                            :width="(scope.row.coverPosterWidth + 26) + 'px'">
                            <el-image
                                :style="{ width: scope.row.coverPosterWidth + 'px', height: scope.row.coverPosterHeight + 'px' }"
                                :src="resCoverImageSrc(scope.row.filesBases_id, scope.row.coverPoster)" />
                            <template #reference>
                                <el-icon>
                                    <VideoPlay />
                                </el-icon>
                            </template>
                        </el-popover>
                    </div>
                    <div class="playDiv" v-else @click.stop="clickPlayHandle(EresDetatilsType.play, scope.row)">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="title" :label="$t('resources.form.name')" :show-overflow-tooltip="true" />
            <el-table-column prop="issueNumber" :label="$t('resources.form.versionNumber')" width="120"
                :show-overflow-tooltip="true" />
            <el-table-column prop="address" :label="$t('resources.form.mode')" width="120" :show-overflow-tooltip="true">
                <template #default="scope">
                    {{ $t('resources.form.modeType.' + scope.row.mode) }}
                </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('resources.form.stars')" width="100" :show-overflow-tooltip="true">
                <template #default="scope">
                    <div v-if="scope.row.stars > 0">
                        <el-icon v-for="s, key in scope.row.stars" :key="key" color="#F7BA2A">
                            <StarFilled />
                        </el-icon>
                    </div>
                    <div v-else>-</div>

                </template>
            </el-table-column>
            <el-table-column prop="address" label="-" width="260" :show-overflow-tooltip="true">
                <template #default="scope">
                    <el-breadcrumb class="breadcrumb" separator="|">
                        <el-breadcrumb-item v-if="scope.row.issuingDate != ''">
                            {{ scope.row.issuingDate }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item v-if="scope.row.country != ''">
                            {{ $t('country.' + scope.row.country) }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item v-if="scope.row.definition != ''">
                            {{ $t('definition.' + scope.row.definition) }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { resCoverImageSrc } from "@/assets/fileDbFolder";
import { EresDetatilsType } from "@/dataInterface/common.enum";
import { IresourcesBase } from "@/dataInterface/resources.interface";
import { ref } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
    dataList: {
        type: Array as () => IresourcesBase[],
        required: true,
    }
})
// eslint-disable-next-line no-undef
const emits = defineEmits(['clickHandle']);

const dataListTableRef = ref();

const init = () => {
    try {
        dataListTableRef.value?.setScrollTop(0);
    } catch (e) {
        console.log(e);
    }
}


const clickHandle = (row: IresourcesBase) => {
    emits('clickHandle', EresDetatilsType.show, row);
}

const clickPlayHandle = (type: EresDetatilsType, row: IresourcesBase) => {
    emits('clickHandle', type, row);
}

// eslint-disable-next-line no-undef
defineExpose({ init });

</script>
<style scoped>
.dataListTableModeMain {
    width: calc(100% - 20px);
    padding: 0px 10px 10px 10px;
    height: calc(100% - 10px);
    overflow: hidden;
}

.playDiv {
    width: 100%;
    height: 100%;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}


.breadcrumb {
    font-size: 12px;
}
</style>