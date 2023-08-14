<template>
    <div class="indexMenu">
        <div class="title">
            <img src="~@/assets/logo_24.png" />
            <label>{{ softwareInformation.softwareName }}</label>
            <span>{{ softwareInformation.version }}</span>
        </div>
        <div class="menuTool">
            <div class="mItem">
                <el-button-group size="small">
                    <el-button icon="Minus" @click.stop="changeWindowSize('min')" />
                    <!--CopyDocument-->
                    <el-button icon="FullScreen" @click.stop="changeWindowSize('max')" />
                    <el-button icon="CloseBold" @click.stop="execWindowClose" />
                </el-button-group>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ipcRendererSend } from "@/electronCommon"
import softwareInformation from "@/setup/softwareInformation"

const changeWindowSize = (type = 'min') => {
    ipcRendererSend.changeWindowSize(type);
}
const execWindowClose = () => {
    ipcRendererSend.execWindowClose();
}

</script>
<style scoped>
.indexMenu {
    height: 30px;
    margin-bottom: 2px;
    overflow: hidden;
    background-color: #ECF5FF;
    display: flex;
    justify-content: space-between;
    -webkit-user-select: none;
    user-select: none;
}

.indexMenu .title {
    width: calc(100% - 122px);
    display: flex;
    padding: 4px 0px 0px 5px;
    /**该属性可以拖动app，需要在创建窗口是，设置movable: true */
    -webkit-app-region: drag;
}

.indexMenu .title img {
    width: 20px;
    height: 20px;
    display: block;
}

.indexMenu .title label {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    padding: 0px 8px;
    overflow: hidden;
    display: block;
}

.indexMenu .title span {
    font-size: 11px;
    color: #9D9D9D;
    line-height: 26px;
    display: block;
    overflow: hidden;
}

.indexMenu .menuTool {
    display: flex;
}

.indexMenu .menuTool .mItem {
    padding: 2px 5px 0px 5px;
}
</style>