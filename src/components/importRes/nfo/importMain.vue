<template>
    <div>
        <div class="block">
            <div class="blockTitle">
                <el-alert :title="$t('import.importPath')" type="success" :closable="false" />
            </div>
            <div class="blockBody">
                <div class="row">
                    <div class="illustrate">{{ $t('import.importIllustrate') }}</div>
                </div>
                <div class="row">
                    <el-input v-model="retrieveFolderPath" class="rowWidth400"
                        :placeholder="$t('import.importPathPlaceholder')">
                        <template #append>
                            <el-button icon="Search" @click="selectRetrieveFolders">
                                {{ $t('import.select') }}
                            </el-button>
                        </template>
                    </el-input>
                </div>
                <div class="row">
                    <label>{{ $t('import.coverPosterType') }}: </label>
                    <el-select v-model="coverPosterMode">
                        <el-option v-for="item, index in store.filesBasesSettingStore.config.coverPosterData" :key="index"
                            :label="item.name" :value="index" />
                    </el-select>
                </div>
            </div>
        </div>
        <div class="block">
            <div class="blockTitle">
                <el-alert :title="$t('import.nfoConfigTitle')" type="warning" :closable="false" />
            </div>
            <div class="blockBtnGroup">
                <el-button @click="restoreDefaultValues">
                    {{ $t('import.restoreDefaultValues') }}
                </el-button>
            </div>
            <div class="blockBody">
                <div class="rowTwo">
                    <div class="rowTitle">suffix name</div>
                    <div class="rowValue"><el-input v-model="nofConfig.suffix"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">root</div>
                    <div class="rowValue"><el-input v-model="nofConfig.root"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">title</div>
                    <div class="rowValue"><el-input v-model="nofConfig.title"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">issueNumber</div>
                    <div class="rowValue"><el-input v-model="nofConfig.issueNumber"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">year</div>
                    <div class="rowValue"><el-input v-model="nofConfig.year"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">cover</div>
                    <div class="rowValue"><el-input v-model="nofConfig.cover"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">cover suffix name</div>
                    <div class="rowValue"><el-input v-model="nofConfig.coverSuffix"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">cover url</div>
                    <div class="rowValue"><el-input v-model="nofConfig.coverUrl"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">tag</div>
                    <div class="rowValue"><el-input v-model="nofConfig.tag"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">removed tag</div>
                    <div class="rowValue"><el-input v-model="nofConfig.removedTag"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">abstract</div>
                    <div class="rowValue"><el-input v-model="nofConfig.abstract"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">country</div>
                    <div class="rowValue"><el-input v-model="nofConfig.country"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">star</div>
                    <div class="rowValue"><el-input v-model="nofConfig.star"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">performer</div>
                    <div class="rowValue"><el-input v-model="nofConfig.performer"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">performer name</div>
                    <div class="rowValue"><el-input v-model="nofConfig.performerName"></el-input></div>
                </div>
                <div class="rowTwo">
                    <div class="rowTitle">performer thumb</div>
                    <div class="rowValue"><el-input v-model="nofConfig.performerThumb"></el-input></div>
                </div>
            </div>
        </div>
    </div>
    <importShowList ref="importShowListRef"></importShowList>
</template>
<script setup lang="ts">
import importShowList from './importShowList.vue';
import { ElMessage } from 'element-plus'
import { nfoToRes } from "@/abilities/importNfo"
import loading from '@/assets/loading'
import { IfilesBasesNofConfig } from '@/dataInterface/filesBasesSetting.interface';
import { ipcRendererSend } from "@/electronCommon"
import { filesBasesSettingServerData } from '@/serverData/filesBasesSetting.serverData';
import { filesBasesStore } from '@/store/filesBases.store';
import { filesBasesSettingStore } from '@/store/filesBasesSetting.store';
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const store = {
    filesBasesStore: filesBasesStore(),
    filesBasesSettingStore: filesBasesSettingStore(),
}
const importShowListRef = ref<InstanceType<typeof importShowList>>();
const retrieveFolderPath = ref('');
const coverPosterMode = ref(0);
const defaultNofConfig: IfilesBasesNofConfig = {
    suffix: '.mp4|.avi|.rmvb|.wmv|.mov|.mkv|.flv|.ts|.webm|.iso|.mpg|.m4v',
    root: 'movie',
    title: 'originaltitle|title|sorttitle',
    issueNumber: 'num',
    year: 'releasedate|premiered|year',
    cover: 'poster|thumb|fanart',
    coverSuffix: 'jpg|jpeg|png',
    coverUrl: 'cover',
    tag: 'tag|genre',
    removedTag: '',
    abstract: 'outline|plot',
    country: 'country',
    star: 'star',
    performer: 'actor',
    performerName: 'name',
    performerThumb: 'thumb',
}

const nofConfig = reactive({ ...defaultNofConfig });

const selectRetrieveFolders = () => {
    const path = ipcRendererSend.dialogGetFolderPathSync();
    if (path != undefined) {
        retrieveFolderPath.value = path;
    }
}

const restoreDefaultValues = () => {
    setNofConfig(defaultNofConfig);
}

const setNofConfig = (config: IfilesBasesNofConfig) => {
    if (config) {
        for (const key in config) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            nofConfig[key] = config[key];
        }
    }
}

const getNofConfig = async () => {
    loading.open();
    nextTick(async () => {
        const config = await filesBasesSettingServerData.getNfoConfigByfilesBasesId(store.filesBasesStore.currentFilesBases.id);
        setNofConfig(config);
        await loading.closeSync();
    })
}

const submit = async () => {
    if (retrieveFolderPath.value == '') {
        ElMessage({ message: t('import.pleaseSelectFolder'), type: 'error' })
        return
    }
    loading.open();
    await filesBasesSettingServerData.saveNfoConfigByfilesBasesId(store.filesBasesStore.currentFilesBases.id, nofConfig);
    try {
        const dataList = await nfoToRes(retrieveFolderPath.value, nofConfig);
        importShowListRef.value?.open(dataList, coverPosterMode.value);
    } catch (error: unknown) {
        ElMessage({ message: error as string, type: 'error' })
    }

    await loading.closeSync();

}

const open = async () => {
    await getNofConfig();
}

// eslint-disable-next-line no-undef
defineExpose({ open, submit })

</script>
<style>
.block {
    padding: 10px;
}

.blockBtnGroup {
    padding: 5px 10px;
    display: flex;
    justify-content: flex-end;
}

.row {
    padding: 5px;
    overflow: hidden;
}

.rowTitle {
    line-height: 32px;
    padding-right: 10px;
}

.rowTwo {
    width: 100%;
    display: flex;
    padding: 5px 0px;
}

.rowTwo .rowTitle {
    width: 150px;
    padding-right: 20px;
    text-align: right;
}

.rowTwo .rowValue {
    width: calc(90% - 170px);
}
</style>