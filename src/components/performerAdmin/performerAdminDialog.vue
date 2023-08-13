<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="$t('performer.admin')" width="1280px"
        :close-on-click-modal="false" append-to-body>
        <performerAdminMain ref="performerAdminMainRef"></performerAdminMain>
    </el-dialog>
</template>
<script setup lang="ts">
import performerAdminMain from "./performerAdminMain.vue"
import { ref, nextTick } from 'vue'
const performerAdminMainRef = ref<InstanceType<typeof performerAdminMain>>();
const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true;
}

// eslint-disable-next-line no-undef
defineExpose({
    open
})

</script>
<style scoped></style>