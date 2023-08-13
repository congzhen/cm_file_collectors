<template>
    <div class="settingsMain">
        <el-scrollbar height="100%">
            <div class="settingMainBody">
                <div class="settingMainBlock">
                    <div class="blockTitle">
                        <el-alert :title="$t('settings.basicSettings.title')" type="success" :closable="false" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.basicSettings.countryList') }}</h5>
                        <el-select class="select-full" v-model="countryData" multiple>
                            <el-option-group v-for="(countryList, key) in dataset.country" :key="key" :label="key">
                                <el-option v-for="item in countryList" :key="item" :label="$t('country.' + item)"
                                    :value="item"></el-option>
                            </el-option-group>
                        </el-select>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.basicSettings.definition') }}</h5>
                        <el-select class="select-full" v-model="definitionData" multiple>
                            <el-option v-for="item in dataset.definition" :key="item" :label="$t('definition.' + item)"
                                :value="item" />
                        </el-select>
                    </div>
                </div>
                <div class="settingMainBlock">
                    <div class="blockTitle">
                        <el-alert :title="$t('settings.leftSidebar.title')" type="success" :closable="false" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.leftSidebar.leftSidebarShowItem') }}</h5>
                        <el-select class="select-full" v-model="leftDisplayData" multiple>
                            <el-option v-for="item in dataset.leftDisplay" :key="item" :label="$t('defaultTag.' + item)"
                                :value="item" />
                        </el-select>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.leftSidebar.leftSidebarTagShowMode') }}</h5>
                        <el-select v-model="tagModeData">
                            <el-option v-for="item in dataset.tagMode" :key="item" :label="$t('defaultTag.tagMode.' + item)"
                                :value="item" />
                        </el-select>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.performerTag.title') }}</h5>
                        <el-checkbox v-model="performerPhotoData" :label="$t('settings.performerTag.showPerformerPhoto')"
                            border />
                        <el-checkbox v-model="shieldNoPerformerPhotoData"
                            :label="$t('settings.performerTag.shieldNoPerformerPhoto')" border />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.performerTag.performerShowNum') }}</h5>
                        <el-input-number v-model="performerShowNumData" :min="1" :max="999" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.performerTag.performerPreferred') }}</h5>
                        <div class="select-full">
                            <comMultipleSearchSelect v-model="performerPreferredData"
                                :dataList="store.performerStore.getPerformerListByFilesBasesId"
                                :selectField="['name', 'aliasName']" :showSelectField="['name', 'aliasName']">
                            </comMultipleSearchSelect>
                        </div>

                    </div>
                </div>
                <div class="settingMainBlock">
                    <div class="blockTitle">
                        <el-alert :title="$t('settings.parameterSettings.title')" type="success" :closable="false" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.pageLimit') }}</h5>
                        <el-input-number v-model="pageLimitData" :min="1" :max="999" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.sortMode') }}</h5>
                        <el-select v-model="sortModeData">
                            <el-option v-for="item in dataset.sortMode" :key="item"
                                :label="$t('settings.parameterSettings.sortModeData.' + item)" :value="item" />
                        </el-select>
                    </div>

                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.resourcesShowMode') }}</h5>
                        <el-select v-model="resourcesShowModeData">
                            <el-option v-for="item in dataset.resourcesShowMode" :key="item"
                                :label="$t('settings.parameterSettings.resourcesShowModeData.' + item)" :value="item" />
                        </el-select>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.detailsDramaSeriesMode') }}</h5>
                        <el-select v-model="detailsDramaSeriesModeData">
                            <el-option v-for="item in dataset.detailsDramaSeriesMode" :key="item"
                                :label="$t('settings.parameterSettings.detailsDramaSeriesModeData.' + item)"
                                :value="item" />
                        </el-select>
                    </div>

                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.title') }}</h5>
                        <el-checkbox v-model="historyModuleData"
                            :label="$t('settings.parameterSettings.enableRecordingModule.history')" border />
                        <el-checkbox v-model="hotModuleData"
                            :label="$t('settings.parameterSettings.enableRecordingModule.hot')" border />
                        <el-checkbox v-model="youLikeModuleData"
                            :label="$t('settings.parameterSettings.enableRecordingModule.youLike')" border />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.historyNumber') }}</h5>
                        <el-input-number v-model="historyNumberData" :min="1" :max="999" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.hotNumber') }}</h5>
                        <el-input-number v-model="hotNumberData" :min="1" :max="999" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.youLikeNumber') }}</h5>
                        <el-input-number v-model="youLikeNumberData" :min="1" :max="999" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.youLikeWordNumber') }}</h5>
                        <el-input-number v-model="youLikeWordNumberData" :min="1" :max="99" />
                    </div>

                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.youLikeHasTagClass') }}</h5>
                        <el-select class="select-full" v-model="youLikeTagClassData" multiple>
                            <el-option
                                v-for="item, index in store.tagClassStore.getTagClassListByfilesBasesId(store.filesBasesStore.currentFilesBases.id)"
                                :key="index" :label="item.name" :value="item.id" />
                        </el-select>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.parameterSettings.enableRecordingModule.youLikeNowWord') }}</h5>
                        <div class="flexDiv">
                            <el-tag v-for="tag, key in youLikeNowWord" :key="key">{{ tag.name }}</el-tag>

                        </div>
                    </div>

                    <div class="settingMainItem">
                        <h5>{{ $t('settings.play.playAtlasMode') }}</h5>
                        <el-select v-model="playAtlasModeData">
                            <el-option v-for="item in dataset.playAtlasMode" :key="item"
                                :label="$t('settings.play.playAtlasModeData.' + item)" :value="item" />
                        </el-select>
                    </div>
                </div>


                <div class="settingMainBlock">
                    <div class="blockTitle">
                        <el-alert :title="$t('settings.plugin.title')" type="success" :closable="false" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('plugin.cup.name') }}<label>{{ $t('plugin.cup.describe') }}</label></h5>
                        <el-checkbox v-model="plugInUnit_CupData" :label="$t('plugin.cup.settingsPluginOpen')" border />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('plugin.cup.showText') }}</h5>
                        <div class="select-full">
                            <el-input v-model="plugInUnit_Cup_TextData" />
                        </div>
                    </div>
                </div>
                <div class="settingMainBlock">
                    <div class="blockTitle">
                        <el-alert :title="$t('settings.coverPoster.title')" type="success" :closable="false" />
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.coverPoster.setSize') }}<label>{{ $t('settings.coverPoster.setSizeDefinition')
                        }}</label>
                        </h5>
                        <div class="coverPosterAdmin">
                            <ul>
                                <el-radio-group v-model="coverPosterDataDefaultSelectData">
                                    <li v-for="( item, index ) in  coverPosterData " :key="index">
                                        <el-radio class="coverPosterAdmin-radio" :label="index">
                                            <div class="coverPosterAdmin-radio-block">
                                                <div class="coverPosterAdmin-name">
                                                    <el-input v-if="item.type == 'default'" v-model="item.name" size="small"
                                                        :disabled="true"></el-input>
                                                    <el-input v-else v-model="item.name" size="small"
                                                        :disabled="item.type == 'default' ? true : false"></el-input>
                                                </div>
                                                <label class="coverPosterAdmin-text">{{ $t('settings.coverPoster.width')
                                                }}:</label>
                                                <el-input-number v-model="item.width" controls-position="right" size="small"
                                                    :min="20" :max="1280"
                                                    :disabled="item.type == 'default' ? true : false"></el-input-number>
                                                <label class="coverPosterAdmin-text">{{ $t('settings.coverPoster.height')
                                                }}:</label>
                                                <el-input-number v-model="item.height" controls-position="right"
                                                    size="small" :min="20" :max="800"
                                                    :disabled="item.type == 'default' ? true : false"></el-input-number>
                                                <label class="coverPosterAdmin-bz">{{ coverPosterBz(item.width, item.height)
                                                }}</label>
                                                <el-button class="coverPosterAdmin-btn" type="danger" icon="delete"
                                                    size="small" v-if="item.type != 'default'"
                                                    @click="deleteCoverPoster(index)"></el-button>
                                            </div>

                                        </el-radio>
                                    </li>
                                </el-radio-group>
                            </ul>
                            <div>
                                <el-button plain @click="addCoverPoster">{{ $t('settings.coverPoster.addButton')
                                }}</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="settingMainItem">
                        <h5>{{ $t('settings.coverPoster.displayHeight') }}<label>{{
                            $t('settings.coverPoster.displayHeightDefinition')
                        }}</label></h5>
                        <div class="select-full">
                            <el-checkbox v-model="coverPosterHeightStatusData"
                                :label="$t('settings.coverPoster.openCoverPosterHeightStatus')" border />
                            <label>{{
                                $t('settings.coverPoster.heightBase')
                            }}：</label><el-input-number v-model="coverPosterHeightBaseData" :min="50" :max="1080" />
                        </div>

                    </div>
                </div>

            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import dataset from "@/assets/dataset"
import { ratio } from "@/assets/math"
import loading from '@/assets/loading'
import comMultipleSearchSelect from "@/components/common/comMultipleSearchSelect.vue"
import { performerStore } from "@/store/performer.store"
import { tagClassStore } from "@/store/tagClass.store"
import { filesBasesStore } from "@/store/filesBases.store"
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store"
import { filesBasesSettingServerData } from "@/serverData/filesBasesSetting.serverData"
import { tagServerData } from '@/serverData/tag.serverData';
import { computed, ref } from 'vue';
import { Itag } from "@/dataInterface/tag.interface"
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
    tagClassStore: tagClassStore(),
    performerStore: performerStore(),
}


const countryData = computed({
    get: () => store.filesBasesSettingStore.config.country,
    set: (value) => store.filesBasesSettingStore.config.country = value,
});
const definitionData = computed({
    get: () => store.filesBasesSettingStore.config.definition,
    set: (value) => store.filesBasesSettingStore.config.definition = value,
});
const leftDisplayData = computed({
    get: () => store.filesBasesSettingStore.config.leftDisplay,
    set: (value) => store.filesBasesSettingStore.config.leftDisplay = value,
});
const tagModeData = computed({
    get: () => store.filesBasesSettingStore.config.tagMode,
    set: (value) => store.filesBasesSettingStore.config.tagMode = value,
});
const performerPhotoData = computed({
    get: () => store.filesBasesSettingStore.config.performerPhoto,
    set: (value) => store.filesBasesSettingStore.config.performerPhoto = value,
})
const shieldNoPerformerPhotoData = computed({
    get: () => store.filesBasesSettingStore.config.shieldNoPerformerPhoto,
    set: (value) => store.filesBasesSettingStore.config.shieldNoPerformerPhoto = value,
})
const performerShowNumData = computed({
    get: () => store.filesBasesSettingStore.config.performerShowNum,
    set: (value) => store.filesBasesSettingStore.config.performerShowNum = value,
})
const performerPreferredData = computed({
    get: () => store.filesBasesSettingStore.config.performerPreferred,
    set: (value) => store.filesBasesSettingStore.config.performerPreferred = value,
})
const pageLimitData = computed({
    get: () => store.filesBasesSettingStore.config.pageLimit,
    set: (value) => store.filesBasesSettingStore.config.pageLimit = value,
})
const sortModeData = computed({
    get: () => store.filesBasesSettingStore.config.sortMode,
    set: (value) => store.filesBasesSettingStore.config.sortMode = value,
})
const resourcesShowModeData = computed({
    get: () => store.filesBasesSettingStore.config.resourcesShowMode,
    set: (value) => store.filesBasesSettingStore.config.resourcesShowMode = value,
})

const detailsDramaSeriesModeData = computed({
    get: () => store.filesBasesSettingStore.config.detailsDramaSeriesMode,
    set: (value) => store.filesBasesSettingStore.config.detailsDramaSeriesMode = value,
})

const playAtlasModeData = computed({
    get: () => store.filesBasesSettingStore.config.playAtlasMode,
    set: (value) => store.filesBasesSettingStore.config.playAtlasMode = value,
})

const historyModuleData = computed({
    get: () => store.filesBasesSettingStore.config.historyModule,
    set: (value) => store.filesBasesSettingStore.config.historyModule = value,
})
const hotModuleData = computed({
    get: () => store.filesBasesSettingStore.config.hotModule,
    set: (value) => store.filesBasesSettingStore.config.hotModule = value,
})
const youLikeModuleData = computed({
    get: () => store.filesBasesSettingStore.config.youLikeModule,
    set: (value) => store.filesBasesSettingStore.config.youLikeModule = value,
})
const historyNumberData = computed({
    get: () => store.filesBasesSettingStore.config.historyNumber,
    set: (value) => store.filesBasesSettingStore.config.historyNumber = value,
})
const hotNumberData = computed({
    get: () => store.filesBasesSettingStore.config.hotNumber,
    set: (value) => store.filesBasesSettingStore.config.hotNumber = value,
})
const youLikeNumberData = computed({
    get: () => store.filesBasesSettingStore.config.youLikeNumber,
    set: (value) => store.filesBasesSettingStore.config.youLikeNumber = value,
})
const youLikeWordNumberData = computed({
    get: () => store.filesBasesSettingStore.config.youLikeWordNumber,
    set: (value) => {
        store.filesBasesSettingStore.config.youLikeWordNumber = value;
        getYouLikeNowWord();
    }
})
const youLikeTagClassData = computed({
    get: () => store.filesBasesSettingStore.config.youLikeTagClass,
    set: (value) => {
        store.filesBasesSettingStore.config.youLikeTagClass = value
        getYouLikeNowWord();
    },
})
const plugInUnit_CupData = computed({
    get: () => store.filesBasesSettingStore.config.plugInUnit_Cup,
    set: (value) => store.filesBasesSettingStore.config.plugInUnit_Cup = value,
})
const plugInUnit_Cup_TextData = computed({
    get: () => store.filesBasesSettingStore.config.plugInUnit_Cup_Text,
    set: (value) => store.filesBasesSettingStore.config.plugInUnit_Cup_Text = value,
})
const coverPosterDataDefaultSelectData = computed({
    get: () => store.filesBasesSettingStore.config.coverPosterDataDefaultSelect,
    set: (value) => store.filesBasesSettingStore.config.coverPosterDataDefaultSelect = value,
})
const coverPosterHeightStatusData = computed({
    get: () => store.filesBasesSettingStore.config.coverPosterHeightStatus,
    set: (value) => store.filesBasesSettingStore.config.coverPosterHeightStatus = value,
})
const coverPosterHeightBaseData = computed({
    get: () => store.filesBasesSettingStore.config.coverPosterHeightBase,
    set: (value) => store.filesBasesSettingStore.config.coverPosterHeightBase = value,
})

const coverPosterData = computed({
    get: () => store.filesBasesSettingStore.config.coverPosterData,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set: () => { },
})

const youLikeNowWord = ref<Itag[]>();


const getYouLikeNowWord = async () => {
    youLikeNowWord.value = await tagServerData.getYouLikeTag(store.filesBasesStore.currentFilesBases.id, store.filesBasesSettingStore.config.youLikeWordNumber, store.filesBasesSettingStore.config.youLikeTagClass);
}

const addCoverPoster = () => {
    store.filesBasesSettingStore.config.coverPosterData.push({ name: 'DiyCover', width: 480, height: 270, type: 'diy' });
}
const deleteCoverPoster = (index: number) => {
    store.filesBasesSettingStore.config.coverPosterData.splice(index, 1);
}
const coverPosterBz = (width: number, height: number) => {
    return ratio(width, height).join(' : ');
}

const openSettings = async () => {
    await getYouLikeNowWord();
}

const saveSettings = async () => {
    loading.open();
    await filesBasesSettingServerData.saveConfig(store.filesBasesStore.currentFilesBases.id, store.filesBasesSettingStore.config);
    await loading.closeSync();
}

// eslint-disable-next-line no-undef
defineExpose({ openSettings, saveSettings });

</script>
<style scoped>
.settingsMain {
    width: 100%;
    height: 100%;
}

.settingMainBody {
    padding: 0px 8px 20px 4px;
}

.settingMainBlock {
    padding-bottom: 10px;
}

.blockTitle {
    padding-bottom: 10px;
}

.settingMainItem {
    padding: 0px 10px 10px 10px;
}

.settingMainItem h5 {
    line-height: 22px;
    padding-left: 2px;
}

.settingMainItem h5 label {
    padding-left: 20px;
    font-size: 12px;
    font-weight: normal;
    color: #E6A23C;
}

.settingMainItem .select-full {
    width: 80%;
}

.settingMainItem .flexDiv {
    display: flex;
    flex-wrap: wrap;
}

.settingMainItem .flexDiv .el-tag {
    margin: 0px 10px 10px 0px;
}



.coverPosterAdmin ul {
    list-style-type: none;
    padding: 10px 20px 10px 20px;
}

.coverPosterAdmin li {
    display: flex;
    padding: 5px 0px;
    line-height: 28px;
}

.coverPosterAdmin li .coverPosterAdmin-radio {
    height: 28px;

}

.coverPosterAdmin li .coverPosterAdmin-radio-block {
    display: flex;
}

.coverPosterAdmin li .coverPosterAdmin-name {
    width: 120px;
}

.coverPosterAdmin .coverPosterAdmin-text {
    padding: 0px 10px 0px 20px;
}

.coverPosterAdmin .coverPosterAdmin-bz {
    min-width: 100px;
    padding-left: 20px;
    overflow: hidden;
}

.coverPosterAdmin .coverPosterAdmin-btn {
    margin-top: 2px;
}
</style>