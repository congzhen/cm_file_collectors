<template>
    <div class="tagLogic" tabindex="-1">
        <el-dropdown @command="selectDropdownItem" placement="bottom-end">
            <span class="el-dropdown-link">
                <el-icon :size="14" :style="{ paddingRight: '3px', color: getDropdownItemColor() }">
                    <HelpFilled />
                </el-icon>
                <el-icon :size="14">
                    <ArrowDown />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-item :command="EsearchLogic.single" v-if="props.showItem.includes(EsearchLogic.single)"
                    v-bind:style="{ color: selectCommand == EsearchLogic.single ? '#409EFF' : '' }">
                    {{ $t('tag.tagBlockCondition.single') }}
                </el-dropdown-item>
                <el-dropdown-item :command="EsearchLogic.or" v-if="props.showItem.includes(EsearchLogic.or)"
                    v-bind:style="{ color: selectCommand == EsearchLogic.or ? '#409EFF' : '' }">
                    {{ $t('tag.tagBlockCondition.multiple') }} ({{ $t('tag.tagBlockCondition.or') }})
                </el-dropdown-item>
                <el-dropdown-item :command="EsearchLogic.and" v-if="props.showItem.includes(EsearchLogic.and)"
                    v-bind:style="{ color: selectCommand == EsearchLogic.and ? '#409EFF' : '' }">
                    {{ $t('tag.tagBlockCondition.multiple') }} ({{ $t('tag.tagBlockCondition.and') }})
                </el-dropdown-item>
                <el-dropdown-item :command="EsearchLogic.not" v-if="props.showItem.includes(EsearchLogic.not)"
                    v-bind:style="{ color: selectCommand == EsearchLogic.not ? '#409EFF' : '' }">
                    {{ $t('tag.tagBlockCondition.not') }}
                </el-dropdown-item>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { EsearchLogic } from "@/dataInterface/common.enum"

// eslint-disable-next-line no-undef
const props = defineProps({
    showItem: {
        type: Array,
        default: () => {
            return [EsearchLogic.single, EsearchLogic.or, EsearchLogic.and, EsearchLogic.not];
        }
    }
});

// eslint-disable-next-line no-undef
const emit = defineEmits<{
    (e: 'updataSelect', selectValue: EsearchLogic): void
}>()

const selectCommand = ref<EsearchLogic>(EsearchLogic.single);

const selectDropdownItem = function (item: EsearchLogic) {
    selectCommand.value = item
    emit('updataSelect', item)
}
const getDropdownItemColor = function (): string {
    switch (selectCommand.value) {
        case EsearchLogic.single:
            return '#92BD29';
        case EsearchLogic.or:
            return '#E6A23C';
        case EsearchLogic.and:
            return '#F56C6C';
        case EsearchLogic.not:
            return '#4D4D4D';
    }
}
</script>
<style scoped>
.tagLogic .el-dropdown-link {
    cursor: pointer;
    font-size: 11px;
    padding: 2px 5px;
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 #ffffff;
}

.tagLogic .el-dropdown-link:focus {
    border: 0px;
}
</style>