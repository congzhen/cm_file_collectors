<template>
    <div class="indexMenu">
        <div class="title">
            <img src="~@/assets/logo_24.png" />
            <label>{{ softwareInformation.softwareName }}</label>
            <span>{{ softwareInformation.version }}</span>
        </div>
        <div class="menuTool">
            <div class="mItem friendlyRewards">
                <el-link type="primary" :underline="false" @click="cl_friendlyRewards">{{ $t('menu.friendlyRewards')
                }}</el-link>
            </div>
            <div class="mItem">
                <el-button-group size="small">
                    <el-button icon="Minus" @click="changeWindowSize('min')" />
                    <!--CopyDocument-->
                    <el-button icon="FullScreen" @click="changeWindowSize('max')" />
                    <el-button icon="CloseBold" @click="execWindowClose" />
                </el-button-group>
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogVisibleFriendlyRewards" :title="$t('menu.friendlyRewards')" width="400px" append-to-body>
        <div class="friendlyRewardsImage">
            <img src="~@/assets/weixin.jpg">
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ipcRendererSend } from "@/electronCommon"
import softwareInformation from "@/setup/softwareInformation"
import { ref } from 'vue'
const dialogVisibleFriendlyRewards = ref(false);
const changeWindowSize = (type = 'min') => {
    ipcRendererSend.changeWindowSize(type);
}
const execWindowClose = () => {
    ipcRendererSend.execWindowClose();
}
const cl_friendlyRewards = () => {
    dialogVisibleFriendlyRewards.value = true
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
}

.indexMenu .title {
    display: flex;
    padding: 4px 0px 0px 5px;

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

.indexMenu .menuTool .friendlyRewards {
    line-height: 24px;
    overflow: hidden;
}

.friendlyRewardsImage {
    display: flex;
    justify-content: center;
}
</style>