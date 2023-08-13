<template>
    <div>
        <div class="titleAlert">
            <el-alert :title="$t('system.tags.updateLogs')" type="success" :closable="false" />
        </div>
        <div class="updataLogsBody">
            <el-timeline>
                <el-scrollbar height="500px">
                    <el-timeline-item timestamp="2018/4/12" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 1.1.5</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">视频流服务器增加 hls,m3u8</p>
                            <p class="logContent">m3u8模式首次点播视频时，将在视频文件夹中创建.m3u8文件(时间根据电脑配置和视频长短而定)</p>
                            <p class="logContent">m3u8点播时，尽量使用移动端(手机，平板电脑)，会支持的更好，pc端在切换分段时有可能会出现加载</p>
                            <p class="logContent">推荐使用夸克浏览器，该浏览器有推送视频流功能，直接将视频流推送到电视上，可以用电视观看。部分手机自带的浏览器也有该功能</p>
                            <p class="logContent">m3u8流在播放时，将自动进行视频分割转码，分割时仅从源视频提取，不会创建新视频</p>
                            <p class="logContent">为了提高转码速度，视频将直接copy 视频编码 和 音频编码，特殊音频编码可能会没有声音</p>
                            <p class="logContent">分段转码默认为30s</p>
                            <p class="logContent">到视频源目录下，删除.m3u8文件，再次使用时可以重新生成</p>
                            <p class="logContent">目前IOS上，该功能不能使用</p>
                            <p class="logContent">目前rmvb这种老格式将直接无法转码</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item center timestamp="2018/4/12" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 1.1.5</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">视频流服务器增加 hls,m3u8</p>
                            <p class="logContent">m3u8模式首次点播视频时，将在视频文件夹中创建.m3u8文件(时间根据电脑配置和视频长短而定)</p>
                            <p class="logContent">m3u8点播时，尽量使用移动端(手机，平板电脑)，会支持的更好，pc端在切换分段时有可能会出现加载</p>
                            <p class="logContent">推荐使用夸克浏览器，该浏览器有推送视频流功能，直接将视频流推送到电视上，可以用电视观看。部分手机自带的浏览器也有该功能</p>
                            <p class="logContent">m3u8流在播放时，将自动进行视频分割转码，分割时仅从源视频提取，不会创建新视频</p>
                            <p class="logContent">为了提高转码速度，视频将直接copy 视频编码 和 音频编码，特殊音频编码可能会没有声音</p>
                            <p class="logContent">分段转码默认为30s</p>
                            <p class="logContent">到视频源目录下，删除.m3u8文件，再次使用时可以重新生成</p>
                            <p class="logContent">目前IOS上，该功能不能使用</p>
                            <p class="logContent">目前rmvb这种老格式将直接无法转码</p>
                        </div>
                    </el-timeline-item>
                </el-scrollbar>
            </el-timeline>
        </div>
    </div>
</template>
<style scoped>
.titleAlert {
    padding-bottom: 20px;
}

.updataLogsBody {
    padding-left: 30px;
}

h4,
h5 {
    line-height: 24px;
}

.rawContent {
    padding: 0px 20px;
}

.logContent {
    line-height: 18px;
    font-size: 12px;
    padding: 5px 20px 5px 20px;
}

.logContentSubUl {
    list-style-type: disc;
    font-size: 12px;
}
</style>