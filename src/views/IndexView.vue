<template>
    <div class="index">
        <indexMenuView></indexMenuView>
        <IndexHeaderView></IndexHeaderView>
        <IndexBodyView ref="IndexBodyViewRef" style="height:calc(100% - 32px - 50px)"></IndexBodyView>
    </div>
</template>
  
<script lang="ts" setup>
import indexMenuView from './indexMenuView.vue';
import IndexHeaderView from './IndexHeaderView.vue';
import IndexBodyView from './IndexBodyView.vue';
import { ref, provide } from 'vue';
import { EresUpdate } from '@/dataInterface/common.enum';
import { IresourcesBase } from '@/dataInterface/resources.interface';
const IndexBodyViewRef = ref<InstanceType<typeof IndexBodyView>>();
const indexUpdateResourcesData = async (_up: Array<EresUpdate> = [EresUpdate.updateData, EresUpdate.updataDetailsView]) => {
    if (_up.includes(EresUpdate.updateData)) {
        await IndexBodyViewRef.value?.updateData();
    }
    if (_up.includes(EresUpdate.updataDetailsView)) {
        await IndexBodyViewRef.value?.updataDetailsView();
    }
}
const indexPlayResourcesData = async (resInfo: IresourcesBase) => {
    await IndexBodyViewRef.value?.playRes(resInfo);
}
provide('indexUpdateResourcesData', indexUpdateResourcesData);
provide('indexPlayResourcesData', indexPlayResourcesData);
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
  