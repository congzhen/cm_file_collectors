<template>
    <div>
        <div class="titleAlert">
            <el-alert :title="$t('system.tags.updateLogs')" type="success" :closable="false" />
        </div>
        <div class="updataLogsBody">
            <el-timeline>
                <el-scrollbar height="500px">
                    <el-timeline-item timestamp="2023/9/20" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.6</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">增加深色主题</p>
                            <p class="logContent">增加清晰度在封面显示时自定义颜色设置</p>
                            <p class="logContent">增加将标签自定义设置到封面显示上</p>
                            <p class="logContent">增加详情栏的标签可以点击为新的检索条件，该检索条件是独立的，不与左侧标签栏条件冲突</p>
                            <p class="logContent">增加左侧标签栏的浮动模式以及自定义宽度</p>
                            <p class="logContent">增加导入nfo文件时，移除某些tag的配置（removed tag）</p>
                            <p class="logContent">增加批量nfo导入时，可以将文件夹下的其他视频文件导入为剧集</p>
                            <p class="logContent">添加视频和演员时，海报可以拖动上传</p>
                            <p class="logContent">增加拖拽添加资源信息功能</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复历史记录，热度，猜你喜欢，点击无反应情况</p>
                            <p class="logContent">修复图集模式大量图片导致程序卡死</p>
                            <p class="logContent">修复修改资源时，因前次使用多选搜索功能，导致遗留搜索条件问题</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/9/7" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.5</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">增加读取视频文件夹下预览图</p>
                            <p class="logContent">导入演员集数据指定目标</p>
                            <p class="logContent">增加虚拟路径转换功能</p>
                            <p class="logContent">批量导入后重启软件更改为刷新数据</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/8/25" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.4</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">增加网络视频链接</p>
                            <p class="logContent">增加低分辨率适配（将就用下吧，时分不完美）</p>
                            <p class="logContent">更新web端，增加播放视频链接以及排序方式</p>
                            <p class="logContent">添加.nfo文件导入时，海报优先匹配海报配置项词语</p>
                            <p class="logContent">增加海报宽度基数设置选项</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/8/14" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.3</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">增加批量.nfo文件导入数据</p>
                            <p class="logContent">增加弹窗式详情页</p>
                            <p class="logContent">增加发行时间排序</p>
                            <p class="logContent">增加标签分类与标签删除后恢复功能</p>
                            <p class="logContent">增加演员删除后恢复功能</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复标签和演员删除后，导致编辑时，无法正显示标签名。删除后的标签，如果资源上还存在，则会显示Delete Item</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/8/14" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.2</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">增加窗口化拖动的功能</p>
                            <p class="logContent">去掉了友情打赏</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复一些隐形bug</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/8/13" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.1</h4>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">紧急修复影响体验的bug</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item center timestamp="2023/8/13" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.0</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">v2版发布</p>
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