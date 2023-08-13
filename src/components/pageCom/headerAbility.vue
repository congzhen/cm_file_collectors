<template>
    <div class="headerAbility">
        <el-popover placement="bottom-start" :width="500" trigger="hover" @before-enter="beforeEnter">
            <el-tabs v-model="activeTab" type="card" lazy-render>
                <el-tab-pane :label="$t('headers.ability.history')" name="history"
                    v-if="store.filesBasesSettingStore.config.historyModule">
                    <el-scrollbar height="500px">
                        <headerAbilityTabItem v-for="res, key in historyList" :key="key" :dataInfo="res">
                        </headerAbilityTabItem>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane :label="$t('headers.ability.hot')" name="hot"
                    v-if="store.filesBasesSettingStore.config.hotModule">
                    <el-scrollbar height="500px">
                        <headerAbilityTabItem v-for="res, key in hotList" :key="key" :dataInfo="res">
                        </headerAbilityTabItem>
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane :label="$t('headers.ability.youLike')" name="youLike"
                    v-if="store.filesBasesSettingStore.config.youLikeModule">
                    <el-scrollbar height="500px">
                        <headerAbilityTabItem v-for="res, key in youLikeList" :key="key" :dataInfo="res">
                        </headerAbilityTabItem>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
            <template #reference>
                <el-icon :size="20">
                    <Calendar />
                </el-icon>
            </template>
        </el-popover>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import headerAbilityTabItem from "./headerAbilityTabItem.vue"
import { filesBasesStore } from '@/store/filesBases.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { resourcesServerData } from "@/serverData/resources.serverData"
import { Iresources } from '@/dataInterface/resources.interface';
import { tagServerData } from '@/serverData/tag.serverData';
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
};
const activeTab = ref<string>('history');

const historyList = ref<Array<Iresources>>([]);
const hotList = ref<Array<Iresources>>([]);
const youLikeList = ref<Array<Iresources>>([]);

const beforeEnter = async () => {
    if (store.filesBasesSettingStore.config.historyModule) {
        historyList.value = await resourcesServerData.getDataListOrderLastPlayTime(store.filesBasesStore.currentFilesBases.id, store.filesBasesSettingStore.config.historyNumber);
    }
    if (store.filesBasesSettingStore.config.hotModule) {
        hotList.value = await resourcesServerData.getDataListOrderHot(store.filesBasesStore.currentFilesBases.id, store.filesBasesSettingStore.config.hotNumber);
    }
    if (store.filesBasesSettingStore.config.youLikeModule) {
        const likeTags = await tagServerData.getYouLikeTag(store.filesBasesStore.currentFilesBases.id, store.filesBasesSettingStore.config.youLikeWordNumber, store.filesBasesSettingStore.config.youLikeTagClass);
        const tagsIdArr: Array<string> = likeTags.map(tag => { return tag.id });
        youLikeList.value = await resourcesServerData.getDataListOrderYouLike(store.filesBasesStore.currentFilesBases.id, tagsIdArr, store.filesBasesSettingStore.config.youLikeNumber);
    }
}

</script>
<style scoped>
.headerAbility {
    cursor: pointer;
}
</style>