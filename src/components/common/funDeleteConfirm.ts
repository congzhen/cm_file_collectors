import i18n from "@/setup/language"
const deleteConfirm = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    exec: (text: string, successCallBack: () => void = () => { }, failCallBack: () => void = () => { }) => {
        import('element-plus').then(({ ElMessageBox }) => {
            const t = i18n.global.t;
            ElMessageBox.confirm(
                t('com.message.deleteWarning', [text]),
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
            deleteConfirm.success(text);
        } else {
            deleteConfirm.delete(text);
        }
    },
    success: (text: string) => {
        import('element-plus').then(({ ElMessage }) => {
            const t = i18n.global.t;
            ElMessage({ message: t('com.message.deleteSuccess', [text]), type: 'success' });
        });
    },
    delete: (text: string) => {
        import('element-plus').then(({ ElMessage }) => {
            const t = i18n.global.t;
            ElMessage({ message: t('com.message.deleteFail', [text]), type: 'error' });
        });
    },
};
export default deleteConfirm;