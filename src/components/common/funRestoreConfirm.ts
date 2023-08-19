import i18n from "@/setup/language"
const restoreConfirm = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    exec: (text: string, successCallBack: () => void = () => { }, failCallBack: () => void = () => { }) => {
        import('element-plus').then(({ ElMessageBox }) => {
            const t = i18n.global.t;
            ElMessageBox.confirm(
                t('com.message.restoreWarning', [text]),
                t('com.message.warning'),
                {
                    confirmButtonText: t('com.message.OK'),
                    cancelButtonText: t('com.message.cancel'),
                    type: 'warning',
                },
            ).then(successCallBack).catch(failCallBack);
        });
    },
    message: (status: boolean, text: string) => {
        if (status) {
            restoreConfirm.success(text);
        } else {
            restoreConfirm.restore(text);
        }
    },
    success: (text: string) => {
        import('element-plus').then(({ ElMessage }) => {
            const t = i18n.global.t;
            ElMessage({ message: t('com.message.restoreSuccess', [text]), type: 'success' });
        });
    },
    restore: (text: string) => {
        import('element-plus').then(({ ElMessage }) => {
            const t = i18n.global.t;
            ElMessage({ message: t('com.message.restoreFail', [text]), type: 'error' });
        });
    },
};
export default restoreConfirm;