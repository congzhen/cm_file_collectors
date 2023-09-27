<template>
    <div class="comForm">
        <div v-if="props.dialogForm">
            <el-dialog v-model="dialogVisible" :title="formTitle" :width="props.dialogWidth" :close-on-click-modal="false"
                :append-to-body="true">
                <el-form ref="ruleFormDialogRef" :model="props.modelValue" :rules="props.rules"
                    :label-width="props.labelWidth" :label-position="props.labelPosition" :size="props.size" status-icon>
                    <slot></slot>
                    <el-form-item>
                        <div :class="[props.btnPosition + '-btnPosition']">
                            <el-button v-if="showBtn('submit')" type="primary" @click="submitForm(ruleFormDialogRef)">{{
                                $t('com.form.submit')
                            }}</el-button>
                            <el-button v-if="showBtn('close')" @click="dialogClose">{{ $t('com.form.close') }}</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <div class="comForm-noDialog" v-else>
            <el-form ref="ruleFormRef" :model="props.modelValue" :rules="props.rules" :label-width="props.labelWidth"
                :label-position="props.labelPosition" :size="props.size" status-icon>
                <div class="formComMain">
                    <slot></slot>
                </div>
                <el-form-item>
                    <div :class="[props.btnPosition + '-btnPosition']">
                        <el-button v-if="showBtn('submit')" type="primary" @click="submitForm(ruleFormRef)">{{
                            $t('com.form.submit')
                        }}</el-button>
                        <el-button v-if="showBtn('reset')" @click="resetForm(ruleFormRef)">{{ $t('com.form.reset') }}
                        </el-button>
                        <el-button v-if="showBtn('goback')" @click="$emit('goBack')">{{ $t('com.form.goback') }}
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// eslint-disable-next-line no-undef
const props = defineProps({
    dialogForm: {
        type: Boolean,
        default: true,
    },
    dialogWidth: {
        type: String,
        default: '480px',
    },
    formTitle: {
        type: String,
        default: '',
    },
    modelValue: {
        required: true,
        type: Object
    },
    rules: {
        type: Object,
        default: () => {
            return reactive<FormRules>({});
        }
    },
    labelWidth: {
        type: String,
        default: '120px',
    },
    labelPosition: {
        type: String,
        default: 'right',
    },
    size: {
        type: String,
        default: 'default',
    },
    btnGroup: {
        type: Array,
        default: () => ["submit", "close"], // ['submit','close','reset','goback']
    },
    btnPosition: {
        type: String,
        default: '',//['',right]
    },
});

// eslint-disable-next-line no-undef
const emits = defineEmits(['update:modelValue', 'submit', 'reset', 'goBack']);

const ruleFormDialogRef = ref<FormInstance>();
const ruleFormRef = ref<FormInstance>();

const mode = ref('add');
const dialogVisible = ref(false);

const open = (_mode: string) => {
    mode.value = _mode;
    if (props.dialogForm) {
        dialogOpen();
    }
}
const dialogOpen = () => {
    if (dialogVisible.value == false) {
        dialogVisible.value = true;
    }
}
const dialogClose = () => {
    if (dialogVisible.value == true) {
        dialogVisible.value = false;
    }
}

const showBtn = (btnName: string) => {
    if (props.btnGroup.indexOf(btnName) > -1) {
        return true;
    } else {
        return false;
    }
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
}

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            emits('submit', mode.value);
        } else {
            return false
        }
    })
}

const message = (_status: boolean, _message: string) => {
    if (_status) {
        success(_message);
    } else {
        fail(_message);
    }
}

const success = (message: string) => {
    ElMessage({ message: message, type: 'success' })
    dialogClose();
}

const fail = (message: string) => {
    ElMessage({ message: message, type: 'error' })
    dialogClose();
}

// eslint-disable-next-line no-undef
defineExpose({ open, message, success, fail });

</script>
<style scoped>
.comForm-noDialog {
    width: 100%;
    height: 100%;
}

.right-btnPosition {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>