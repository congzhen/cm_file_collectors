# 该版本不在更新，新版本在 [Github](https://github.com/congzhen/cm_collectors_3)

# 如果有问题，或需求，可以发邮件或者 TG 联系

# E-mail: czpk673@gmail.com

# Telegram: [@czpk673](https://t.me/wsq222987)

# ------------------------------------------------

# cm_file_collectors 本地视频文件管理(Local video file management)

这个软件功能都是我平时用到的，如果有别的好想法可以给我发邮件，或者自己改下代码。现在确实都是手动录入的，我自己对手动整理十分上头，打算写一个插件功能，用插件来实现自动填写录入信息。

## 部署方式

### 1.安装

```
nodejs
```

### 2.安装依赖

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

### 3.运行

```
yarn dev
```

### 4.打包

```
yarn electron:build
```

### 有任何问题可以联系我 O(∩_∩)O

E-mail: congzhen17173@163.com
