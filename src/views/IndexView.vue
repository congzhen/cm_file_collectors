<template>
    <div class="index">
        <indexMenuView></indexMenuView>
        <IndexHeaderView></IndexHeaderView>
        <IndexBodyView ref="IndexBodyViewRef" style="height:calc(100% - 32px - 50px)"></IndexBodyView>
    </div>
</template>
  
<script lang="ts" setup>
import { Throttle } from '@/assets/tool';
import indexMenuView from './indexMenuView.vue';
import IndexHeaderView from './IndexHeaderView.vue';
import IndexBodyView from './IndexBodyView.vue';
import { ref, provide, onMounted } from 'vue';
import { EresUpdate } from '@/dataInterface/common.enum';
import { IresourcesBase } from '@/dataInterface/resources.interface';
import { IresUpdateDetailsView } from '@/dataInterface/common.interface';
const IndexBodyViewRef = ref<InstanceType<typeof IndexBodyView>>();
const indexUpdateResourcesData = async (_up: Array<EresUpdate> = [EresUpdate.updateData, EresUpdate.updataDetailsView]) => {
    let updateDataObj;
    if (_up.includes(EresUpdate.updateData)) {
        updateDataObj = await IndexBodyViewRef.value?.setNowPageAndUpdateData(1);
    }
    if (_up.includes(EresUpdate.updataDetailsView)) {
        await IndexBodyViewRef.value?.updataDetailsView();
    }
    if (_up.includes(EresUpdate.updataDetailsViewByUpdateDataFirstRecord)) {
        const resUpdateDetailsView: IresUpdateDetailsView = {
            id: updateDataObj?.dataList[0]?.id,
        }
        await IndexBodyViewRef.value?.updataDetailsView(resUpdateDetailsView);
    }
}
const indexPlayResourcesData = async (resInfo: IresourcesBase) => {
    await IndexBodyViewRef.value?.playRes(resInfo);
}
provide('indexUpdateResourcesData', indexUpdateResourcesData);
provide('indexPlayResourcesData', indexPlayResourcesData);

const ThrottleClass = new Throttle();
const addEventListenerResize = () => {
    window.addEventListener('resize', () => {
        ThrottleClass.throttleTimeout(() => {
            IndexBodyViewRef.value?.resize();
        })
    });
}
onMounted(async () => {
    addEventListenerResize();
})
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
  