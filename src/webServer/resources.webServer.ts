import path from 'path'
import { Express } from 'express'
import setupConfig from "@/setup/config"
import { resourcesServerData } from "@/serverData/resources.serverData"
import { IsearchCondition } from "@/dataInterface/common.interface";

import { resourcesDramaSeriesServerData } from '@/serverData/resourcesDramaSeries.serverData';
import { readDirImage, existsFile } from '@/assets/file';
const registerApiResrouces = (app: Express) => {
    app.post('/api/resroucesDataList/:filesBasesId/:page/:limit/:sortMode', async (req, res) => {
        const filesBases_id = req.params.filesBasesId;
        const page = parseInt(req.params.page);
        const limit = parseInt(req.params.limit);
        const sortMode = req.params.sortMode ? req.params.sortMode : 'desc';
        const searchCondition = JSON.parse(req.body.condition) as IsearchCondition;

        //console.log(filesBases_id, page, limit, searchCondition, sortMode);
        const data = await resourcesServerData.getDataListPagingBySearchCondition(filesBases_id, searchCondition, page, limit, sortMode);
        res.json(data);
    });


    app.get('/api/resroucesInfo/:id/', async (req, res) => {
        const id = req.params.id;
        const data = await resourcesServerData.getInfoById(id);
        res.json(data);
    });


    app.get('/api/resrouceCoverPoster/:filesBasesId/:coverPoster', async (req, res) => {
        const filesBases_id = req.params.filesBasesId;
        const coverPoster = req.params.coverPoster;
        const coverPosterPath = path.join(setupConfig.resCoverPosterPath, filesBases_id);
        res.sendFile(coverPoster, { root: coverPosterPath });
    });


    app.get('/api/image/:path', async (req, res) => {
        const path = decodeURI(req.params.path);
        res.sendFile(path);
    });

    app.get('/api/resourceDramaSeriesImageInfo/:dramaSeriesId/', async (req, res) => {
        const dramaSeriesId = req.params.dramaSeriesId;
        const dramaSeriesInfo = await resourcesDramaSeriesServerData.getDramaSeriesInfoById(dramaSeriesId);
        const resourcesBaseInfo = await resourcesServerData.getBaseInfoById(dramaSeriesInfo.resources_id);
        const filesList = await readDirImage(dramaSeriesInfo.src);
        res.json({ ...dramaSeriesInfo, filesList, title: resourcesBaseInfo.title });
    });
    app.get('/api/resourceDramaSeriesVideoInfo/:mode/:dramaSeriesId/', async (req, res) => {
        const dramaSeriesId = req.params.dramaSeriesId;
        const mode = req.params.mode;
        const dramaSeriesInfo = await resourcesDramaSeriesServerData.getDramaSeriesInfoById(dramaSeriesId);
        const resourcesBaseInfo = await resourcesServerData.getBaseInfoById(dramaSeriesInfo.resources_id);
        let m3u8 = false;
        if (mode == 'm3u8') {
            if (existsFile(dramaSeriesInfo.src + '.m3u8')) {
                m3u8 = true;
            }
        }
        res.json({ ...dramaSeriesInfo, title: resourcesBaseInfo.title, mode, m3u8 });
    });

}

export { registerApiResrouces }
