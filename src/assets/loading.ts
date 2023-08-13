import { ElLoading } from 'element-plus'

const loading = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadingHandle: null as any,
    loadingOption: {
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    },
    open: function () {
        this.loadingHandle = ElLoading.service(this.loadingOption);
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    close: function (fn: () => {}) {
        this.loadingHandle.close();
        fn();
    },
    closeSync: function () {
        return new Promise((resolve) => {
            this.loadingHandle.close();
            resolve(true)
        });
    }
}

export default loading;

