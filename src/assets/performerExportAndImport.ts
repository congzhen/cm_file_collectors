import path from 'path';
import fs from 'fs';
import setupConfig from '@/setup/config';
import { performerStore } from '@/store/performer.store';
import { performerBasesStore } from '@/store/performerBases.store';
import { readDir, existsFile } from "@/assets/file";
import { Iperformer } from '@/dataInterface/performer.interface';
import { performerBasesServerData } from '@/serverData/performerBases.serverData';
import { performerServerData } from '@/serverData/performer.serverData';
export const exportPerformer = function (performerDatabasesId: string, savePath: string) {
    const performerFacePath = path.join(setupConfig.performerFacePath, `/${performerDatabasesId}/`);
    const performerFaceImageList = readDir(performerFacePath + '', ['jpg', 'jpeg', 'png']);
    const exportData = {
        performerDatabasesId,
        performerDatabasesName: performerBasesStore().getPerformerBasesById(performerDatabasesId)?.name,
        dataList: performerStore().getPerformerListyPerformerBasesId(performerDatabasesId),
        performerFace: performerFaceImageList.map(src => {
            return { name: path.basename(src), data: fs.readFileSync(path.join(performerFacePath, src)).toString('base64') };
        })
    }
    fs.writeFileSync(path.join(savePath, '/performerFace-' + performerDatabasesId + '.json'), JSON.stringify(exportData, null, 2));
}

export const importPerformer = async function (fileName: string) {
    try {
        const importData: {
            performerDatabasesId: string,
            performerDatabasesName: string,
            dataList: Array<Iperformer>,
            performerFace: Array<{ name: string, data: string }>
        } = JSON.parse(fs.readFileSync(fileName).toString('utf-8'));
        const performerFacePath = path.join(setupConfig.performerFacePath, `/${importData.performerDatabasesId}/`);
        const performerDatabasesInfo = await performerBasesServerData.getInfoById(importData.performerDatabasesId);
        if (performerDatabasesInfo == undefined) {
            const addResult = await performerBasesServerData.addSimple(importData.performerDatabasesId, importData.performerDatabasesName);
            if (!addResult) {
                return false;
            }
            fs.mkdirSync(performerFacePath, { recursive: true });
        }
        const result = {
            performerCount: 0,
            performerFaceCount: 0,
        }

        result.performerCount = await performerServerData.addPerformerDataList(importData.dataList);

        for (const imageData of importData.performerFace) {
            const _file = path.join(performerFacePath, imageData.name);
            if (!existsFile(_file)) {
                const buffer = Buffer.from(imageData.data, 'base64');
                fs.writeFileSync(_file, buffer);
                result.performerFaceCount++;
            }
        }
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }

}