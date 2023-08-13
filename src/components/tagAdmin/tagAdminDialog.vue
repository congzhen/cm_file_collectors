<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('tag.admin')" width="1000px"
        :close-on-click-modal="false" append-to-body>
        <div class="tagAdminMainK">
            <tagAdminMain></tagAdminMain>
        </div>
        <template #footer>
            <el-button type="success" @click="addClass">{{ $t('tag.addClass') }}</el-button>
        </template>
        <tagAdminClassAdd ref="tagAdminClassAddRef"></tagAdminClassAdd>
    </el-dialog>
</template>
<script setup lang="ts">
import tagAdminMain from "./tagAdminMain.vue"
import tagAdminClassAdd from "./tagAdminClassAdd.vue";
import { ref } from 'vue'
const tagAdminClassAddRef = ref<InstanceType<typeof tagAdminClassAdd>>();
const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true;
}

const addClass = () => {
    tagAdminClassAddRef.value?.open('add');
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
</style>