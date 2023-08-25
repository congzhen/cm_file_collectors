import fs from 'fs';
import path from 'path';
import { Response } from 'express'
import setupConfig from '@/setup/config';
import { existsFile } from '@/assets/file';
import { spawn, exec } from 'child_process';

const ffmpegPath = path.join(setupConfig.basePath, '/static/ffmpeg/ffmpeg.exe')
const ffprobePath = path.join(setupConfig.basePath, '/static/ffmpeg/ffprobe.exe')

function pathSpaceConversion(src: string) {
    return src.replace(/(\s+)/g, '" "');
}
function execPromise(arg: string): Promise<string> {
    return new Promise((r, j) => {
        exec(arg, (err, stdout) => {
            if (err) {
                j(err)
            } else {
                r(stdout)
            }
        })
    });
}

export interface IvideoAttributeInfo {
    codec_type: string,
    codec_name: string,
    width: string,
    height: string,
    duration: string,
    bit_rate: string,
    size: string,
}

export const ffprobeTool = {
    getVideoInfo: async function (videoFile: string) {
        try {
            //const execStr = `${ffprobePath} -v error -show_format -show_streams ${pathSpaceConversion(videoFile)}`;
            const execStr = `${ffprobePath} -v error -select_streams v:0 -show_entries stream=codec_type,codec_name,width,height,duration,bit_rate -show_entries format=size -of csv=p=0 ${pathSpaceConversion(videoFile)}`;
            const cmdReadKeyframeExec = await execPromise(execStr);
            const infoArr = cmdReadKeyframeExec.split(',');
            const otherArr = infoArr[5].split("\r\n");
            return {
                codec_type: infoArr[0],
                codec_name: infoArr[1],
                width: infoArr[2],
                height: infoArr[3],
                duration: infoArr[4],
                bit_rate: otherArr[0],
                size: otherArr[1],
            } as IvideoAttributeInfo
        } catch (err) {
            console.log(err);
            return {
                codec_type: "",
                codec_name: "",
                width: "",
                height: "",
                duration: "",
                bit_rate: "",
                size: "",
            } as IvideoAttributeInfo
        }

    },
}

export const mp4 = {
    createVideoMP4Stream: function (res: Response, src: string, range: string | undefined,) {
        if (range) {
            const stats = fs.statSync(src);
            const r = range.match(/=(\d+)-(\d+)?/) as RegExpMatchArray;
            const start = parseInt(r[1], 10);
            let end = r[2] ? parseInt(r[2], 10) : start + 1024 * 1024 * 1;
            if (end > stats.size - 1) end = stats.size - 1;
            const head = {
                'Content-Type': 'video/mp4',
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Content-Length': end - start + 1,
                'Accept-Ranges': 'bytes'
            }
            res.writeHead(206, head);
            fs.createReadStream(src, { start: start, end: end }).pipe(res);
        } else {
            fs.createReadStream(src).pipe(res);
        }
    }
}

export const ffmpeg = {
    getVideoSegmentedStreaming: function (videoFile: string, start: string, duration: string) {
        const cs = ['-ss', start, '-i', videoFile, '-t', duration, '-vcodec', 'copy', '-acodec', 'copy', '-f', 'hls', '-bsf:v', 'h264_mp4toannexb', '-output_ts_offset', start, '-'];
        const childSpaw = spawn(ffmpegPath, cs);
        childSpaw.stdout.on("data", (_data) => {
            //console.log(`out`);
            //console.log(`out:${data}`);
        })
        childSpaw.stderr.on("data", (_data) => {
            //const dstr = data.toString().replace(/\s*/g, "")
            //console.log('error',dstr);
        })
        childSpaw.on("close", (data) => {
            console.log("close" + data);
        })
        //childSpaw.stdin.pipe(process.stdin)
        //childSpaw.stdout.pipe(res)
        return childSpaw
    },
}

export const m3u8 = {
    getM3u8File: async function (dramaSeriesId: string, videoFile: string) {
        const m3u8File = videoFile + '.m3u8';
        if (!existsFile(m3u8File)) {
            await this.createM3u8Files(dramaSeriesId, videoFile, m3u8File);
        }
        return fs.readFileSync(m3u8File);
    },
    createM3u8Files: async function (dramaSeriesId: string, videoFile: string, m3u8File: string) {
        const execStr = `${ffprobePath} -v error -skip_frame nokey -select_streams v:0 -show_entries frame=pkt_pts_time -of csv=print_section=0 ${pathSpaceConversion(videoFile)}`;
        const cmdReadKeyframeExec = await execPromise(execStr);

        const _keyframes = cmdReadKeyframeExec.split('\n').map((d) => {
            const trimmed = d.trim();
            if (/^\d+(\.\d+)?$/.test(trimmed)) {
                return +trimmed;
            }
            return NaN;
        }).filter((d) => !isNaN(d));
        //        console.log(cmdReadKeyframeExec.split('\n'));
        //        console.log(_keyframes);
        const { keyframes, maxDuration, addDuration } = this.keyframesFusion(_keyframes);
        const cmdReadMeta = `${ffprobePath} -v quiet -print_format json -show_format -show_streams ${pathSpaceConversion(videoFile)}`;
        const resMeta = JSON.parse(await execPromise(cmdReadMeta));
        const { format: { duration } } = resMeta;
        const fragments = keyframes.map((k, i) => ({
            duration: i === keyframes.length - 1 ? this.numberDecimail(duration - k + addDuration) : this.numberDecimail(keyframes[i + 1] - k + addDuration),
            start: k,
        }));
        const m3u8Data = '#EXTM3U\n' +
            '#EXT-X-PLAYLIST-TYPE:VOD\n' +
            `#EXT-X-TARGETDURATION:${maxDuration + addDuration}\n` +
            `${fragments.map(
                (f) => `#EXTINF:${f.duration},\n/api/hls_video/${dramaSeriesId}/${f.start}/${f.duration}`
            ).join('\n')}\n` +
            '#EXT-X-ENDLIST';
        fs.writeFileSync(m3u8File, m3u8Data);
    },
    keyframesFusion: function (_keyframes: number[], sectionDuration = 30, addDuration = 0) {
        const newFrames = [];
        let maxDuration = 0;
        for (let i = 0; i < _keyframes.length; i++) {
            if (i == 0) {
                newFrames.push(_keyframes[i]);
            }
            const p = _keyframes[i] - newFrames[newFrames.length - 1];
            if (p > sectionDuration) {
                newFrames.push(_keyframes[i]);
                if (p > maxDuration || maxDuration == 0) {
                    maxDuration = p;
                }
            }
        }
        maxDuration = this.numberDecimail(maxDuration);
        //console.log(newFrames);
        //console.log('最大分段:' +maxDuration );
        return {
            keyframes: newFrames,
            maxDuration,
            addDuration: addDuration,
        }
    },
    numberDecimail: function (num: number, dec = 6) {
        const s = Math.pow(10, dec);
        return Math.round(num * s) / s;
    },
}