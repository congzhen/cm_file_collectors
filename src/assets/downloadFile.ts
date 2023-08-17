import axios from "axios";
import fs from 'fs';
import sharp from "sharp";

interface IdownloadImageInfo {
    filePath: string,
    format: string | undefined;
    density: number | undefined;
    width: number | undefined;
    height: number | undefined;
}

export default {
    image: async function (imageUrl: string, savePath: string) {
        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                },
            });
            response.data.pipe(fs.createWriteStream(savePath));

            return new Promise((resolve, reject) => {
                response.data.on('end', async () => {
                    const metadata = await sharp(savePath).metadata();
                    const imageInfo: IdownloadImageInfo = {
                        filePath: savePath,
                        format: metadata.format,
                        density: metadata.density,
                        width: metadata.width,
                        height: metadata.height,
                    }
                    resolve(imageInfo);
                });
                response.data.on('error', (err: unknown) => {
                    reject(err);
                });
            });
        } catch (error) {
            throw new Error('download image error: ' + error);
        }
    },
}

