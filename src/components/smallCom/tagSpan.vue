<template>
    <span :class="['tagSpan', store.filesBasesSettingStore.config.tagMode, props.select !== false ? 'select' : 'noSelect']"
        :title="props.text"><label>{{
            props.text
        }}</label></span>
</template>
<script setup lang="ts">
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store"
// eslint-disable-next-line no-undef
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    select: {
        type: Boolean,
        default: false
    },
});
const store = {
    filesBasesSettingStore: filesBasesSettingStore(),
}
</script>
<style scoped>
.fixed {
    width: 19.6%;
}

.auto {
    width: auto;
}

.auto label {
    padding: 0px 4px;
}

.select {
    color: #FFFFFF;
    background-color: #FFAA47;
}

.noSelect {
    color: #9D9D9D;
    background-color: #F3F3F3;
}

.tagSpan {
    display: block;
    padding: 0px 6px;
    font-size: 12px;
    margin: 2px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
}

.tagSpan label {
    display: block;
    font-size: 12px;
    transform: scale(.9);
    cursor: pointer;
    /*溢出的部分隐藏*/
    overflow: hidden;
    /*文本不换行*/
    white-space: nowrap;
    /*ellipsis:文本溢出显示省略号（...）*/
    text-overflow: ellipsis;
}
</style>