vue
<template>
    <div ref="dropZoneRef" class="drop-zone">
        <p>Drag and drop a file here</p>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';

const dropZoneRef = ref<HTMLDivElement>();

onMounted(() => {
    dropZoneRef.value?.addEventListener('dragover', handleDragOver);
    dropZoneRef.value?.addEventListener('drop', handleDrop);
    dropZoneRef.value?.addEventListener('dragleave', handleDragOver);
    dropZoneRef.value?.addEventListener('dragenter', handleDragOver);
})

const handleDragOver = (event: DragEvent) => {

    event.preventDefault();
    console.log(498798);
};
const handleDrop = (event: DragEvent) => {
    console.log(8989898989);
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
        const files = dataTransfer.files;
        const fileAddress = [];
        for (const file of files) {
            fileAddress.push(URL.createObjectURL(file));
        }
        // Do something with the file address, such as storing it in a data property or emitting an event
        console.log(fileAddress);
    }
}

const handleFileChange = (event: Event) => {
    console.log(event);
}

</script>

<style scoped>
.drop-zone {
    width: 300px;
    height: 200px;
    border: 2px dashed #ccc;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
}

.drop-zone:hover {
    border: 2px dashed #2347e7;
}
</style>