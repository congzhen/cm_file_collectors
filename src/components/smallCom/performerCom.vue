<template>
    <div :class="['performerCom', props.select !== false ? 'select' : 'noSelect']" v-if="props.mode == 'simple'">

        <performerComSubA :performerInfo="props.performerInfo" @showPerRes="showPerRes"></performerComSubA>
    </div>
    <div :class="['performerCom', props.select !== false ? 'select' : 'noSelect']" v-else-if="props.mode == 'brief'">
        <performerComSubA mode="brief" :performerInfo="props.performerInfo" @showPerRes="showPerRes"></performerComSubA>
    </div>
    <div v-else :class="['performerCom', props.select !== false ? 'select' : 'noSelect']">
        <el-popover placement="left" width="380" trigger="click">
            <div v-if="props.performerInfo">
                <performerComSubB :performerInfo="props.performerInfo" :shootingDate="shootingDate"></performerComSubB>
            </div>
            <template #reference>
                <performerComSubA :performerInfo="props.performerInfo" @showPerRes="showPerRes"></performerComSubA>
            </template>
        </el-popover>
    </div>
</template>
<script setup lang="ts">
import { Iperformer } from "@/dataInterface/performer.interface";
import performerComSubA from "./performerComSubA.vue"
import performerComSubB from "./performerComSubB.vue"
// eslint-disable-next-line no-undef
const props = defineProps({
    performerInfo: {
        type: Object as () => Iperformer
    },
    shootingDate: {
        type: String,
        default: undefined,
    },
    mode: {
        type: String,
        default: 'simple',//['simple','popover','brief']
    },
    select: {
        type: Boolean,
        default: false
    },
});
// eslint-disable-next-line no-undef
const emits = defineEmits(['showPerRes']);

const showPerRes = () => {
    emits('showPerRes', props.performerInfo);
}

</script>
<style scoped>
.performerCom {
    width: 71px;
    height: auto;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
}

.noSelect {
    background-color: #FCECAE;
}

.select {
    color: #FFFFFF;
    background-color: #FFAA47;
}
</style>