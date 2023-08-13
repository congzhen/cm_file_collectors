
import path from 'path'
import { Express } from 'express'
import setupConfig from "@/setup/config"
import { filesBasesServerData } from '@/serverData/filesBases.serverData'
import { performerServerData } from '@/serverData/performer.serverData';
import { filesBasesSettingServerData } from '@/serverData/filesBasesSetting.serverData';
import { tagClassServerData } from '@/serverData/tagClass.serverData';
import { tagServerData } from '@/serverData/tag.serverData';
import { filesRelatedPerformerBasesServerData } from '@/serverData/filesRelatedPerformerBases.serverData';

const registerApiBase = (app: Express) => {
    app.get('/api/filesBases', async (req, res) => {
        const filesBases = await filesBasesServerData.getDataList();
        res.json(filesBases);
    });

    app.get('/api/filesRelatedPerformerBases', async (req, res) => {
        const Related = await filesRelatedPerformerBasesServerData.getDataList();
        res.json(Related);
    });

    app.get('/api/filesBasesSetting/:filesBasesId', async (req, res) => {
        const filesBases_id = req.params.filesBasesId;
        const filesBasesSetting = await filesBasesSettingServerData.getConfigByfilesBasesId(filesBases_id);
        res.json(filesBasesSetting);
    });

    app.get('/api/performer', async (req, res) => {
        const performer = await performerServerData.getDataList();
        res.json(performer);
    });
    app.get('/api/performerPhoto/:performerBasesId/:photo', async (req, res) => {
        const performerBases_id = req.params.performerBasesId;
        const photo = req.params.photo;
        const photoPath = path.join(setupConfig.performerFacePath, performerBases_id);
        res.sendFile(photo, { root: photoPath });
    });
    app.get('/api/tagClass', async (req, res) => {
        const tagClass = await tagClassServerData.getDataList();
        res.json(tagClass);
    });
    app.get('/api/tag', async (req, res) => {
        const tag = await tagServerData.getDataList();
        res.json(tag);
    });

}

export { registerApiBase }