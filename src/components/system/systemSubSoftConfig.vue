<template>
    <div class="systemSoftConfig">
        <div class="block">
            <div class="blockTitle">
                <el-alert :title="$t('system.softConfig.serverConfig')" type="success" :closable="false" />
            </div>
            <div class="blockBody">
                <div class="row">
                    <span class="rowTitle">① {{ $t('system.softConfig.port') }}</span>
                    <el-input-number v-model="data.serverPort" :controls="false" />
                </div>
                <div class="row">
                    <span class="rowTitle">② {{ $t('system.softConfig.selfStartingDescribe') }}</span>
                    <el-checkbox v-model="data.autoOpenServer" />
                </div>
                <div class="row">
                    <span class="rowTitle">③ {{ $t('system.softConfig.passwordDescribe') }}</span>
                    <el-input class="rowWidth200" v-model="data.serverPassword" />
                </div>
                <div class="row">
                    <div class="illustrate">{{ $t('system.softConfig.passwordIllustrate') }}</div>
                </div>
            </div>
        </div>
        <div class="block">
            <div class="blockTitle">
                <el-alert :title="$t('system.softConfig.language')" type="success" :closable="false" />
            </div>
            <div class="blockBody">
                <div class="row">
                    <el-select v-model="data.language">
                        <el-option :label="$t('language.zhCn')" value="zhCn" />
                        <el-option :label="$t('language.en')" value="en" />
                        <el-option :label="$t('language.ja')" value="ja" />
                    </el-select>
                </div>
            </div>
        </div>
        <div class="block">
            <div class="blockTitle">
                <el-alert :title="$t('system.softConfig.databasesPath')" type="success" :closable="false" />
            </div>
            <div class="blockBody">
                <div class="row">
                    <div class="illustrate">{{ $t('system.softConfig.databasesPathIllustrate') }}</div>
                </div>
                <div class="row">
                    <el-input v-model="data.dbPath" class="rowWidth400"
                        :placeholder="$t('system.softConfig.databasesPathPlaceholder')">
                        <template #append>
                            <el-button icon="Search" @click="selectDbPath">
                                {{ $t('system.softConfig.select') }}
                            </el-button>
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { softWareConfigData, setSoftWareConfig } from "@/setup/softwareConfig";
import { ipcRendererSend } from "@/electronCommon"
import { reactive } from 'vue'
const data = reactive({
    serverPort: softWareConfigData.serverPort,
    autoOpenServer: softWareConfigData.autoOpenServer,
    serverPassword: softWareConfigData.serverPassword,
    language: softWareConfigData.language,
    dbPath: softWareConfigData.dbPath,
})

const selectDbPath = () => {
    const path = ipcRendererSend.dialogGetFolderPathSync();
    if (path != undefined) {
        data.dbPath = path;
        saveSoftConfig();
    }
}

const saveSoftConfig = () => {
    setSoftWareConfig(data, true);
}

// eslint-disable-next-line no-undef
defineExpose({ saveSoftConfig })

</script>
<style scoped>
.systemSoftConfig {
    width: 100%;
    height: 100%;
}

.block {
    padding: 0px 5px 10px 5px;
}

.blockBody {
    padding: 0px 10px;
}

.row {
    padding: 5px;
    overflow: hidden;
}

.rowTitle {
    line-height: 32px;
    padding-right: 10px;
}

.rowWidth200 {
    width: 200px;
}

.rowWidth400 {
    width: 400px;
}

.row .illustrate {
    padding-left: 18px;
    font-size: 12px;
    color: #E6A23C;
}
</style>