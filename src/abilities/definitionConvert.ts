import dataset from '@/assets/dataset'
function definitionConvert(videoHeight: string) {
    if (videoHeight == "") {
        return '';
    }
    const h = parseInt(videoHeight);
    if (h < 480) {
        return dataset.definition[6];
    } else if (h >= 480 && h < 720) {
        return dataset.definition[5];
    } else if (h >= 720 && h < 1080) {
        return dataset.definition[4];
    } else if (h >= 1080 && h < 1440) {
        return dataset.definition[3];
    } else if (h >= 1440 && h < 2160) {
        return dataset.definition[2];
    } else if (h >= 2160 && h < 4220) {
        return dataset.definition[1];
    } else if (h >= 4220 && h < 6000) {
        return dataset.definition[0];
    } else {
        return '';
    }
}


export { definitionConvert }
