<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" top="18vh" title="Console" width="700px"
        :close-on-click-modal="false" append-to-body>
        <div class="consoleDialog" ref="consoleMainRef">
            <p v-for="t, key in consoleText" :key="key">> {{ t }}</p>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const dialogVisible = ref(false);
const consoleMainRef = ref<HTMLDivElement>();
const consoleText = ref<Array<string>>([]);
const open = () => {
    consoleText.value = ['start run'];
    dialogVisible.value = true;
}
const addMessage = (text: string) => {
    consoleText.value.push(text);
    if (consoleMainRef.value) {
        consoleMainRef.value.scrollTop = consoleMainRef.value.scrollHeight;
    }

}

// eslint-disable-next-line no-undef
defineExpose({
    open,
    addMessage
});
</script>
<style scoped lang="scss">
.consoleDialog {
    height: 420px;
    padding: 20px;
    background-color: #0C0C0C;
    color: #CCCCCC;
    overflow-y: scroll;
}
</style>