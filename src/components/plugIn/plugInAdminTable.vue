<template>
    <div class="container">
        <el-table :data="pluginDataList" height="450px" border size="small" style="width: 100%">
            <el-table-column prop="pluginName" :label="$t('pluginAdmin.table.title')"></el-table-column>
            <el-table-column width="68">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="run(scope.row)">Run</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <plugInAdminConsole ref="plugInAdminConsoleRef"></plugInAdminConsole>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import loading from '@/assets/loading'
import axios from "axios";
import fs from 'fs';
import { CoreDb, CoreDbC } from "@/core/core"
import { readDir } from "@/assets/file";
import { ElMessage } from 'element-plus';
import plugInAdminConsole from "./plugInAdminConsole.vue";
import { ref, onMounted, nextTick } from 'vue';

const plugInAdminConsoleRef = ref<InstanceType<typeof plugInAdminConsole>>();

interface IpluginData {
    key: number;
    pluginName: string;
}
const pluginDataList = ref<Array<IpluginData>>([]);

const getPluginDataList = () => {
    return readDir(setupConfig.pluginPath, ['js'])
}

const run = (obj: IpluginData) => {
    const fn = obj.pluginName.split('.')[0] + 'Run';
    plugInAdminConsoleRef.value?.open();
    nextTick(async () => {
        try {
            // eslint-disable-next-line
            const myVariable: any = window;
            await myVariable[fn]({
                console: {
                    addMessage: plugInAdminConsoleRef.value?.addMessage
                },
                loading,
                db: {
                    CoreDbC: CoreDbC,
                    CoreDbS: CoreDb,
                },
                config: setupConfig,
                axios,
                fs,
            });
        } catch (e) {
            console.log(e);
            ElMessage.error(fn + ' function error');
        }
    })

}
const loadScript = (src: string) => {

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        console.log('Script loaded!');
    };
    document.head.appendChild(script);
}


onMounted(() => {
    pluginDataList.value = getPluginDataList().map((item, index) => ({ key: index, pluginName: item }));
    for (const item of pluginDataList.value) {
        loadScript(`${setupConfig.pluginPath}${item.pluginName}`);
    }
})

</script>