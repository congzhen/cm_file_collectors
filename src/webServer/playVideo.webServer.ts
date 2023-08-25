
import { resourcesDramaSeriesServerData } from '@/serverData/resourcesDramaSeries.serverData';
import { Express } from 'express'
import { ffmpeg, m3u8, mp4 } from './m3u8FFmpeg';
const registerApiPlayVideo = (app: Express) => {
    app.get('/api/hls/:dramaSeriesId/video.m3u8', async (req, res) => {
        const dramaSeriesId = req.params.dramaSeriesId;
        const dramaSeriesInfo = await resourcesDramaSeriesServerData.getDramaSeriesInfoById(dramaSeriesId);
        try {
            const dataBuffer = await m3u8.getM3u8File(dramaSeriesId, dramaSeriesInfo.src);
            res.type('application/x-mpegURL')
            res.send(dataBuffer);
        } catch (err) {
            console.log(err)
            res.type('application/x-mpegURL')
            res.status(500).send(err);
        }

    });

    app.get('/api/hls_video/:dramaSeriesId/:start/:duration', async (req, res) => {
        try {
            const dramaSeriesId = req.params.dramaSeriesId;
            const start = req.params.start;
            const duration = req.params.duration;
            const dramaSeriesInfo = await resourcesDramaSeriesServerData.getDramaSeriesInfoById(dramaSeriesId);
            const childSpaw = await ffmpeg.getVideoSegmentedStreaming(dramaSeriesInfo.src, start, duration);
            res.type('video/MP2T')
            childSpaw.stdout.pipe(res)
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });

    app.get('/api/video/:dramaSeriesId/video.mp4', async (req, res) => {
        try {
            const dramaSeriesId = req.params.dramaSeriesId;
            const dramaSeriesInfo = await resourcesDramaSeriesServerData.getDramaSeriesInfoById(dramaSeriesId);
            const range = req.headers['range'];
            mp4.createVideoMP4Stream(res, dramaSeriesInfo.src, range);
        } catch (err) {
            res.write(err);
            res.end();
        }
    });

}
export { registerApiPlayVideo }