<template>
    <div class="dataListMain">
        <el-scrollbar height="100%">
            <div class="content">
                <dataListItemVue v-for="item, key in props.dataList" :key="key" :dataInfo="item" @clickHandle="clickHandle">
                </dataListItemVue>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import dataListItemVue from '@/components/pageCom/dataListItem.vue';
import { EresDetatilsType } from '@/dataInterface/common.enum';
import { IresourcesBase } from "@/dataInterface/resources.interface";
// eslint-disable-next-line no-undef
const props = defineProps({
    dataList: {
        type: Array as () => IresourcesBase[],
        required: true,
    }
})
// eslint-disable-next-line no-undef
const emits = defineEmits(['clickHandle']);

const clickHandle = (type: EresDetatilsType, dataInfo: IresourcesBase) => {
    emits('clickHandle', type, dataInfo);
}

</script>
<style scoped>
.dataListMain {
    width: calc(100% - 20px);
    padding: 0px 10px 0px 10px;
    height: 100%;
}

.content {
    display: flex;
    flex-wrap: wrap;
}
</style>