<template>
    <div class="tableCom">
        <el-table :data="props.dataList" border :stripe="props.stripe" :header-cell-style="headerCellStyle"
            :style="{ width: '100%', height: tableHeight_C }">
            <slot></slot>
            <el-table-column fixed="right" :label="$t('com.table.sort')" width="96" v-if="props.sort">
                <template #default="scope">
                    <el-button-group>
                        <el-button size="small" icon="ArrowUpBold" :disabled="sortDisabled('up', scope.$index)"
                            @click="handleSortRecordClick('up', scope.$index, scope.row)" />
                        <el-button size="small" icon="ArrowDownBold" :disabled="sortDisabled('down', scope.$index)"
                            @click="handleSortRecordClick('down', scope.$index, scope.row)" />
                    </el-button-group>
                </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('com.table.operations')" :width="props.operationsWidth"
                v-if="props.operationsBtnList.length > 0">
                <template #default="scope">
                    <el-button-group>
                        <el-button v-if="showBtn('edit', scope.row)" size="small"
                            @click="$emit('editRecordClick', scope.row, nowPage)">{{
                                $t('com.table.' + props.operationsBtnEdit)
                            }}</el-button>
                        <el-button v-if="showBtn('delete', scope.row)" size="small" type="danger"
                            @click="tableRecordClick(props.operationsBtnDelete, 'delete', scope.row)">{{
                                $t('com.table.' + props.operationsBtnDelete)
                            }}</el-button>
                        <el-button v-if="showBtn('restore', scope.row)" size="small" type="warning"
                            @click="tableRecordClick(props.operationsBtnRestore, 'restore', scope.row)">{{
                                $t('com.table.' + props.operationsBtnRestore)
                            }}</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="props.paging" class="pagination">
            <el-pagination v-model:current-page="nowPage" background small layout="prev, pager, next" :total="props.total"
                :page-size="props.pageLimit" @current-change="changePage" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n';
const headerCellStyle = {
    backgroundColor: '#85bb19',
    color: '#FAFCFF',
}
interface Iobject {
    [ket: string]: unknown;
}

const { t } = useI18n();
// eslint-disable-next-line no-undef
const props = defineProps({
    dataList: {
        type: Array as () => object[],
        default: () => [],
    },
    stripe: {
        type: Boolean,
        default: true
    },
    sort: {
        type: Boolean,
        default: false
    },
    operationsWidth: {
        type: Number,
        default: 180,
    },
    operationsBtnList: {
        type: Array as () => string[],
        default: () => ['edit', 'delete', 'restore'],  //['edit','delete','restore']
    },
    operationsBtnStatusField: {
        type: String,
        default: 'status'
    },
    operationsBtnEdit: {
        type: String,
        default: 'edit',
    },
    operationsBtnDelete: {
        type: String,
        default: 'delete',
    },
    operationsBtnRestore: {
        type: String,
        default: 'restore',
    },
    paging: {
        type: Boolean,
        default: false
    },
    total: {
        type: Number,
        default: 0,
    },
    pageLimit: {
        type: Number,
        default: 30,
    },
    recordTitle: {
        type: String,
        default: 'name'
    }
});
// eslint-disable-next-line no-undef
const emits = defineEmits(['pageChange', 'editRecordClick', 'deleteRecordClick', 'restoreRecordClick', 'sortRecordClick']);

const nowPage = ref(1);
let nowOperationRecord: Iobject;

const tableHeight_C = computed(() => {
    if (props.paging) {
        return 'calc(100% - 34px)';
    } else {
        return '100%';
    }
})

const showBtn = (btnName: string, record: Iobject): boolean => {
    if (props.operationsBtnList.indexOf(btnName) > -1) {
        switch (btnName) {
            case 'delete':
                if (record[props.operationsBtnStatusField]) {
                    return true;
                }
                break;
            case 'restore':
                if (!record[props.operationsBtnStatusField]) {
                    return true;
                }
                break;
            default:
                return true;
        }
    }
    return false;
}
const sortDisabled = (type: string, index: number) => {
    if (type == 'up') {
        return index == 0 ? true : false;
    } else {
        return (index == props.dataList.length - 1) ? true : false;
    }
}
const handleSortRecordClick = (type: string, index: number, record: Iobject) => {
    emits('sortRecordClick', type, index, record)
}
const changePage = (_nowPage: number) => {
    nowPage.value = _nowPage;
    emits('pageChange', _nowPage);
}
const tableRecordClick = (_type: string, _mode: string, record: Iobject) => {
    const msgType = _type + 'Warning';
    ElMessageBox.confirm(
        t('com.message.' + msgType, [record[props.recordTitle]]),
        t('com.message.warning'),
        {
            confirmButtonText: t('com.message.OK'),
            cancelButtonText: t('com.message.cancel'),
            type: 'warning',
        }
    ).then(() => {
        tableRecordClickEmits(_mode, record)
    }).catch(() => { console.log('ElMessageBox ' + _type + ' cancel') });
}
const tableRecordClickEmits = (_mode: string, record: Iobject) => {
    nowOperationRecord = record;
    switch (_mode) {
        case 'delete':
            emits('deleteRecordClick', record);
            break;
        case 'edit':
            emits('editRecordClick', record);
            break;
        case 'restore':
            emits('restoreRecordClick', record);
            break;
    }
}


const deleteSuccess = () => {
    success(t('com.message.' + props.operationsBtnDelete + 'Success', [nowOperationRecord[props.recordTitle]]));
}
const deleteFail = () => {
    fail(t('com.message.' + props.operationsBtnDelete + 'Fail', [nowOperationRecord[props.recordTitle]]));
}
const restoreSuccess = () => {
    success(t('com.message.' + props.operationsBtnRestore + 'Success', [nowOperationRecord[props.recordTitle]]));
}
const restoreFail = () => {
    fail(t('com.message.' + props.operationsBtnRestore + 'Fail', [nowOperationRecord[props.recordTitle]]));
}

const success = (message: string) => {
    ElMessage({ message: message, type: 'success' });
}
const fail = (message: string) => {
    ElMessage({ message: message, type: 'error' });
}
// eslint-disable-next-line no-undef
defineExpose({ deleteSuccess, deleteFail, restoreSuccess, restoreFail, success, fail });

</script>
<style scoped>
.tableCom {
    width: 100%;
    height: 100%;
}
</style>