/** 防抖 **/
class Debounce {
    private timer: number | undefined;
    debounce(func: () => void, wait = 500, ...args: []) {
        clearTimeout(this.timer);
        this.timer = Number(setTimeout(() => {
            func.apply(this, args);
        }, wait));
    }
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
    throttle(func: () => void, wait = 1, ...args: []) {
        const now = Date.now();
        if (now - this.previous > wait) {
            func.apply(this, args);
            this.previous = now;
        }
    }
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