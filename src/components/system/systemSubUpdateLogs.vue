<template>
    <div>
        <div class="titleAlert">
            <el-alert :title="$t('system.tags.updateLogs')" type="success" :closable="false" />
        </div>
        <div class="updataLogsBody">
            <el-timeline>
                <el-scrollbar height="500px">
                    <el-timeline-item timestamp="2023/12/10" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.9</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">添加按资源类型检索的tag标签，需要在设置中开启</p>
                            <p class="logContent">添加排序标签功能，需要在设置中开启</p>
                            <p class="logContent">m3u8自动构建器，需要在系统设置中开启自动构建功能</p>
                            <p class="logContent">更新移动端页面功能，添加资源类型筛选，以及封面上显示清晰度</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复设置中，封面标签会读取其他库得标签问题</p>
                            <p class="logContent">修改资源和头像图片使用函数连接</p>
                            <p class="logContent">修复筛选条件解除后，没有回到第一页</p>
                            <p class="logContent">修复更改标签成功后没有关闭弹窗bug</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/10/13" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.8</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">添加演员隐退选项，隐退后会变为灰色</p>
                            <p class="logContent">添加演员与导演的自定义文字显示，例如将演员改为声优</p>
                            <p class="logContent">添加默认演员头像的自定义</p>
                            <p class="logContent">添加左侧标签栏折叠功能</p>
                            <p class="logContent">漫画模式中增加阅读模式(全屏),增加方向按键翻页和滚动，优化左侧预览</p>
                            <p class="logContent">历史记录中添加最后观看数据</p>
                        </div>
                        <div class="rawContent">
                            <h5>优化</h5>
                            <p class="logContent">
                                图集模式，当文件夹下有大量图片或图片尺寸过大时的加载效率（当图片原尺寸大于显示宽度两倍时，如果开启缩略图，将生成缩略图显示，用以优化显示效率，但是会增加读取速度）</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复详情中，拍摄年龄计算错误以及演员选择后未按选择顺序排序</p>
                            <p class="logContent">修复资源显示时，有滚动条翻页后，滚动条未回到顶部</p>
                            <p class="logContent">修复漫画模式全屏显示时，有滚动条翻页后，滚动条未回到顶部</p>
                        </div>
                    </el-timeline-item>
                    <el-timeline-item timestamp="2023/9/29" placement="top">
                        <h4>{{ $t('system.updateLogs.version') }}：v 2.0.7</h4>
                        <div class="rawContent">
                            <h5>新特性</h5>
                            <p class="logContent">添加功能，批量删除器</p>
                            <p class="logContent">增加标签，演员与演员集的真实删除功能，演员集需要先停用，并解除所有关联才可以删除</p>
                            <p class="logContent">增加文件库删除功能</p>
                            <p class="logContent">添加功能，随机海报封面</p>
                            <p class="logContent">导入增加封面海报使用预设尺寸，可以用来减小导入时海报过大</p>
                            <p class="logContent">导入时增加检测标题配置项</p>
                            <p class="logContent">优化小屏幕添加资源时，全屏效果</p>
                            <p class="logContent">优化添加或修改资源时，从新渲染改为从新渲染多选组件</p>
                            <p class="logContent">切换数据库，将切换右侧详情显示</p>
                        </div>
                        <div class="rawContent">
                            <h5>BUG修复</h5>
                            <p class="logContent">修复因窗口变化，导致浮动模式的左边栏溢出情况</p>
                            <p class="logContent">修改导检索已存在记录的sql错误</p>
                            <p class="logContent">修复关联演员集与导入演员集数据没有刷新</p>
                            <p class="logContent">修复可删除标签的数据混乱与文字显示</p>
                            <p class="logContent">修复nfo导入时，因为tag名称在其他库中存在而未导入的情况</p>
                        </div>
                    </el-timeline-item>
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