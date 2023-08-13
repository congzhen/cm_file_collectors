<template>
    <el-popover placement="bottom-start" trigger="click" :width="width" @before-enter="beforeEnter">
        <template #reference>
            <div ref="multipleSelectRef" class="multipleSelect">
                <div class="multipleSelectTagContainer">
                    <span class="multipleSelectTag" v-for="v, k in  props.modelValue " :key="k">
                        <label class="multipleSelectTagText" v-html="showText(v)">
                        </label>
                        <el-icon size="14px" @click="deleteHandle(k)">
                            <Close />
                        </el-icon>
                    </span>
                </div>
                <div class="multipleSelectTagIdent">
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
            </div>
        </template>
        <div class="multipleSelectContent">
            <div>
                <el-input v-model="searchText" :placeholder="props.placeholderSearch">
                    <template #append>
                        <el-button icon="Search" />
                    </template>
                </el-input>
            </div>
            <div class="multipleSelectList">
                <el-scrollbar height="100%">
                    <div v-bind:class="['multipleSelectListItem', (props.modelValue.indexOf(item[props.valueField] as string) != -1) ? 'selectItem' : '']"
                        v-for=" item, key  in  filteredList " :key="key" @click="cl_select_item(item)">
                        <span class="multipleSelectListItemText" v-html="showSelectText(item)"></span>
                        <el-icon v-if="props.modelValue.includes(item[props.valueField] as string)">
                            <Check />
                        </el-icon>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </el-popover>
</template>
<script setup lang="ts">
import stringSearch from "@/assets/stringSearch"
import { ref, computed, onMounted, nextTick } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
    placeholderSearch: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Array as () => string[],
        default: () => { return [] }
    },
    valueField: {
        type: String,
        default: 'id',
    },
    selectField: {
        type: Array as () => string[],
        default: () => ['name']
    },
    showSelectField: {
        type: Array as () => string[],
        default: () => ['name']
    },
    dataList: {
        type: Array as () => Array<{ [key: string]: unknown }>,
        default: () => []
    }
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['update:modelValue']);

const searchText = ref('');
const width = ref('150px');
const multipleSelectRef = ref<HTMLDivElement>();

const updateVal = (dataArr: Array<string>) => {
    emits('update:modelValue', dataArr);
}
const cl_select_item = (obj: { [key: string]: unknown }) => {
    let index = props.modelValue.indexOf(obj[props.valueField] as string);
    const dataArr = props.modelValue;
    if (index == -1) {
        dataArr.push(obj[props.valueField] as string);
    } else {
        dataArr.splice(index, 1);
    }
    updateVal(dataArr);
}
const showText = (v: string) => {
    for (let i in props.dataList) {
        if (props.dataList[i][props.valueField] == v) {
            return showSelectText(props.dataList[i]);
        }
    }
    return '';
}
const showSelectText = (item: { [key: string]: unknown }) => {
    let s = '<label class="perMainName">' + item[props.showSelectField[0]] + '</label>';
    let a = '';
    if (props.showSelectField.length > 1) {
        for (let f = 1; f < props.showSelectField.length; f++) {
            if (f == 1) {
                a += item[props.showSelectField[f]];
            } else if (f > 1) {
                a += '|' + item[props.showSelectField[f]];
            }
        }
    }
    if (a != '') {
        s += '<i class="otherField">(' + a + ')</i>';
    }
    return s;
}

const FilterList = (item: { [key: string]: unknown }) => {
    if (searchText.value == '') {
        return true;
    }
    let s = '';
    for (var i in props.selectField) {
        s += item[props.selectField[i]];
    }
    return stringSearch(searchText.value, s);
}
const filteredList = computed(() => {
    return props.dataList.filter(FilterList);
});

const deleteHandle = (index: number) => {
    const dataArr = props.modelValue;
    dataArr.splice(index, 1);
    updateVal(dataArr);
}

const setPopoverWidth = () => {
    if (multipleSelectRef.value) {
        width.value = (multipleSelectRef.value.clientWidth + 3) + 'px';
    }
}

const beforeEnter = () => {
    setPopoverWidth();
}
/*
onMounted(() => {
    nextTick(() => {
        setPopoverWidth();
    })
});
*/
</script>
<style scoped>
.multipleSelect {
    width: 100%;
    min-height: 27px;
    height: auto;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    border: 1px solid #C0C4CC;
    border-radius: 5px;
    display: flex;
}

.multipleSelect .multipleSelectTagContainer {
    width: calc(100% - 37px);
    padding: 1px 5px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}

.multipleSelectTag {
    background-color: #F0F2F5;
    font-size: 12px;
    margin: 2px 6px 2px 0;
    padding: 2px 5px;
    display: block;
    border-radius: 3px;
    color: #909399;
    height: 24px;
    line-height: 24px;
    padding: 0 9px;
    display: flex;
}

.multipleSelectTagText {
    display: flex;
    overflow: hidden;
}


.multipleSelectTag>>>.perMainName {
    display: block;
    flex: 0 0 auto;
}

.multipleSelectTag>>>.otherField {
    display: block;
    padding-left: 10px;
    font-size: 10px;
    margin: 1px 0px 0px -2px;
    flex: 1 1 auto;
}



.multipleSelectTag .el-icon {
    margin: 5px 0px 0px 4px;
    cursor: pointer;
}

.multipleSelectTag .el-icon:hover {
    background-color: #909399;
    border-radius: 10px;
    color: #FDFDFD;
}

.multipleSelectTagIdent {
    width: 22px;
    padding-left: 5px;
    height: 27px;
    line-height: 27px;
    cursor: pointer;
}

.multipleSelectContent .multipleSelectList {
    height: 256px;
}

.multipleSelectContent .multipleSelectList .multipleSelectListItem {
    padding: 2px 15px 2px 5px;
    height: 26px;
    line-height: 26px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}

.multipleSelectListItemText {
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.multipleSelectListItemText>>>.otherField {
    padding-left: 10px;
    display: block;
    font-size: 10px;
    margin: 1px 0px 0px -2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}

.multipleSelectContent .multipleSelectList .selectItem {
    color: #409EFF;
}
</style>
