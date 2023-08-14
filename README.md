# cm_file_collectors 本地视频文件管理(Local video file management)

##部署方式
###1.安装 nodejs
###2.安装依赖

注意 sqlite3 只提供源码，所以需要先安装一个可以编译的。我是 windows,所以我直接安装的

```
npm install --global windows-build-tools
```

还需要安装 sharp

```
npm install sharp
```

这两个经常安装出错，有时使用 cnpm 更容易装上

然后正常安装其他依赖即可，我使用的 yarn，基本其余的安装都比较省心，可以事先安装 yarn

###3.运行

```
yarn dev
```

###4.打包

```
yarn electron:build
```

### 有任何问题可以联系我 O(∩_∩)O

E-mail: congzhen17173@163.com
