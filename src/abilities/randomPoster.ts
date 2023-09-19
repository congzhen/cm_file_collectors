import path from 'path'
import { readDir } from "@/assets/file";
import { filesBasesStore } from "@/store/filesBases.store"
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store"

interface IrandomPosterImage {
    [key: string]: Array<string>
}



const randomPosterImage: IrandomPosterImage = {};

const getImageList = (id: string, folderPath: string) => {
    const key = id + folderPath
    if (randomPosterImage[key] !== undefined) {
        return randomPosterImage[key];
    }
    randomPosterImage[key] = readDir(folderPath, ['jpg', 'jpeg', 'png', 'gif'])
}

export default (resTimeName: string) => {
    const config = filesBasesSettingStore().config;
    if (!config.randomPosterStatus || config.randomPosterPath === '') {
        return '';
    }
    const currentFilesBases = filesBasesStore().currentFilesBases;
    const imageList = getImageList(currentFilesBases.id, config.randomPosterPath);
    if (!imageList || imageList.length === 0) {
        return '';
    }

    const key = (new Date(resTimeName).getTime() / 1000) % imageList.length;
    return path.join(config.randomPosterPath, imageList[key]);
}