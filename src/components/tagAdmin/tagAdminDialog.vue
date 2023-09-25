<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('tag.admin')" width="1000px"
        :close-on-click-modal="false" :fullscreen="fullscreen()" append-to-body>
        <div class="tagAdminMainK">
            <tagAdminMain></tagAdminMain>
        </div>
        <template #footer>
            <div class="tagAdminToolList">
                <div class="btnI" @click="openTagsRecycle">
                    <el-icon :size="23">
                        <Delete />
                    </el-icon>
                </div>
                <el-button type="success" @click="addClass">{{ $t('tag.addClass') }}</el-button>
            </div>
        </template>

    </el-dialog>
    <tagAdminClassAdd ref="tagAdminClassAddRef"></tagAdminClassAdd>
    <tagAdminRecycle ref="tagAdminRecycleRef"></tagAdminRecycle>
</template>
<script setup lang="ts">
import setupConfig from "@/setup/config"
import tagAdminRecycle from './tagAdminRecycle.vue';
import tagAdminMain from "./tagAdminMain.vue"
import tagAdminClassAdd from "./tagAdminClassAdd.vue";
import { ref } from 'vue'
const tagAdminRecycleRef = ref<InstanceType<typeof tagAdminRecycle>>();
const tagAdminClassAddRef = ref<InstanceType<typeof tagAdminClassAdd>>();
const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true;
}

const addClass = () => {
    tagAdminClassAddRef.value?.open('add');
}

const openTagsRecycle = () => {
    tagAdminRecycleRef.value?.open();
}

const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped>
.tagAdminMainK {
    width: calc(100% - 20px);
    height: 500px;
    padding: 10px;
    background-color: #F4F4F5;
}

.tagAdminToolList {
    display: flex;
    justify-content: flex-end;
}

.tagAdminToolList .btnI {
    margin: 4px 18px 0px 0px;
    color: #606266;
    cursor: pointer;
}

.tagAdminToolList .btnI:hover {
    color: #5CB6FF;
}
</style>