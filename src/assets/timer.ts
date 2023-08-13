const timer = {
    //获取指定日期时间戳
    getTimeStampTheDay: function (d: string, autoAddHis = true): number {
        if (autoAddHis && /^(\d{4})-(\d{2})-(\d{2})$/.test(d)) {
            d = d + ' 00:00:00';
        }
        return new Date(d).getTime();
        //return Date.parse(new Date(d).toString());
    },
    //获取当前时间戳 该时间戳返回结果包含微妙000
    getTimeStamp: function () {
        return new Date().getTime();
    },
    //格式化
    dateFormat: function (_date: string | number | Date, t = 'Y-m-d') {
        const now = new Date(_date);
        const y = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const m = month < 10 ? '0' + month.toString() : month.toString();
        const d = date < 10 ? '0' + date.toString() : date.toString();
        const h = hour < 10 ? '0' + hour.toString() : hour.toString();
        const i = minute < 10 ? '0' + minute.toString() : minute.toString();
        const s = second < 10 ? '0' + second.toString() : second.toString();
        switch (t) {
            case 'Y-m-d H:i':
                return y + "-" + m + "-" + d + ' ' + h + ':' + i;
            case 'Y-m-d H:i:s':
                return y + "-" + m + "-" + d + ' ' + h + ':' + i + ':' + s;
            case 'm/d':
                return m + '/' + d;
            case 'Y-m':
                return y + '-' + m;
            default:
                return y + "-" + m + "-" + d;
        }
    },
    //获取今天日期
    getToday: function () {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();

        const h = now.getHours();
        const i = now.getMinutes();
        const s = now.getSeconds();
        return {
            date: y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d),
            time: (h < 10 ? '0' + h : h) + '-' + (i < 10 ? '0' + i : i) + '-' + (s < 10 ? '0' + s : s),
        }
    },
    //获取某个日期多少天后是几月几号
    getDateAddDay: function (sDate: string, day: number) {
        return this.dateFormat(this.getTimeStampTheDay(sDate) + (day * 86400000));
    },
}


export default timer;