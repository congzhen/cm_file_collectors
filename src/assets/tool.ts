/** 防抖 **/
class Debounce {
    private timer: number | undefined;
    //防抖函数， 非立即执行版
    //短时间内多次触发同一事件，只执行最后一次，或者只执行最开始的一次，中间的不执行。
    debounce(func: () => void, wait = 500, ...args: []) {
        clearTimeout(this.timer);
        this.timer = Number(setTimeout(() => {
            func.apply(this, args);
        }, wait));
    }
    // 防抖函数，立即执行版
    //立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
    debounceNow(func: () => void, wait = 500, ...args: []) {
        clearTimeout(this.timer);
        const callNow = !this.timer;
        this.timer = Number(setTimeout(() => {
            this.timer = undefined;
        }, wait));
        if (callNow) {
            func.apply(this, args);
        }
    }
}
/** 节流 **/
class Throttle {
    private previous = 0;
    private timeout: number | undefined;
    /*
    *时间戳版和定时器版的节流函数的区别就是，时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候。
    */

    //节流函数，时间戳版
    //指连续触发事件但是在 n 秒中只执行一次函数。即 2n 秒内执行 2 次... 。节流如字面意思，会稀释函数的执行频率。
    throttle(func: () => void, wait = 1, ...args: []) {
        const now = Date.now();
        if (now - this.previous > wait) {
            func.apply(this, args);
            this.previous = now;
        }
    }
    //节流函数，定时器版
    //在持续触发事件的过程中，函数不会立即执行，并且每 1s 执行一次，在停止触发事件后，函数还会再执行一次。
    throttleTimeout(func: () => void, wait = 1, ...args: []) {
        if (!this.timeout) {
            this.timeout = Number(setTimeout(() => {
                this.timeout = undefined;
                func.apply(this, args);
            }, wait));
        }
    }
}
export { Debounce, Throttle };