<template>
    <el-dialog class="mainDialog" v-model="dialogVisible" :title="dialogTitle" width="1320" :fullscreen="fullscreen()"
        :append-to-body="true" :close-on-click-modal="false" @close="close">
        <div class="playVideoBody" ref="playVideoBodyRef">
            <video ref="videoPlayerRef" class="video-js vjs-default-skin" v-once></video>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import setupConfig from "@/setup/config"
import { ref, nextTick } from "vue"

const dialogVisible = ref(false);
const videoPlayerRef = ref<HTMLVideoElement>();
const playVideoBodyRef = ref<HTMLDivElement>();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let player: videojs.Player | null = null;
const dialogTitle = ref('');


const options = {
    width: 1280,
    height: 600,
    controls: true,
    loop: true,
    autoplay: 'auto',
    bigPlayButton: true,
    html5: {
        vhs: {
            overrideNative: true,
        },
        hls: {
            overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
    }
}


const initVideo = () => {
    if (videoPlayerRef.value) {
        player = videojs(videoPlayerRef.value, options);
    }
}

const playVideo = (videoUrl: string, type = "video/mp4") => {
    console.log('playVideo', videoUrl, type);
    if (player) {
        player.src({ type, src: videoUrl });
    }
}

const getPlayVideoBody = () => {
    const pvbr = playVideoBodyRef.value;
    return {
        width: pvbr?.clientWidth,
        height: pvbr?.clientHeight
    }
}

const show = (path: string, title = '') => {
    dialogTitle.value = title;
    dialogVisible.value = true;
    nextTick(() => {
        if (!player) initVideo();
        const { width, height } = getPlayVideoBody();
        player?.width(width);
        player?.height(height);
        console.log(getPlayVideoBody());
        playVideo(path);
    })

}

const close = () => {
    player?.pause();
}

const fullscreen = () => {
    if (window.innerWidth < setupConfig.isFullscreen.width || window.innerHeight < setupConfig.isFullscreen.height) {
        return true;
    }
    return false;
}



// eslint-disable-next-line no-undef
defineExpose({ show });

</script>
<style  scoped></style>