import { defineStore } from "pinia";
import { ItagClass } from "@/dataInterface/tag.interface"
import { tagClassServerData } from "@/serverData/tagClass.serverData"
import { filesBasesStore } from "@/store/filesBases.store";
export const tagClassStore = defineStore('tagClass', {
    state: () => ({
        tagClassList: [] as Array<ItagClass>,
    }),
    getters: {
        getTagClassListByCurrentFilesBases: function (state) {
            const filesBases_id = filesBasesStore().currentFilesBases.id;
            return state.tagClassList.filter(item => item.filesBases_id == filesBases_id && item.status);
        },
        getTagClassListByfilesBasesId: function (state) {
            return (filesBases_id: string, statusMode: 'ALL' | 1 = 1): Array<ItagClass> => {
                return state.tagClassList.filter(item => {
                    if (item.filesBases_id == filesBases_id) {
                        if (statusMode == 'ALL') {
                            return true;
                        } else {
                            return item.status;
                        }
                    }
                    return false;
                });
            }
        },
        getTagClassById: function (state) {
            return (id: string): ItagClass | undefined => {
                for (const key in state.tagClassList) {
                    if (state.tagClassList[key].id == id) {
                        return state.tagClassList[key];
                    }
                }
                return undefined;
            }
        },
        tagClassExist: function (state) {
            return (id: string) => {
                for (let i = 0; i < state.tagClassList.length; i++) {
                    if (state.tagClassList[i].status && state.tagClassList[i].id == id) {
                        return true;
                    }
                }
                return false;
            }
        }

    },
    actions: {
        init: async function () {
            this.tagClassList = await tagClassServerData.getDataList();
        },
        setLeftShow: function (id: string, value: boolean) {
            const tagClassObj = this.getTagClassById(id);
            if (tagClassObj) {
                tagClassObj.leftShow = value;
            }
        },
        setStatus: function (id: string, value: boolean) {
            const tagClassObj = this.getTagClassById(id);
            if (tagClassObj) {
                tagClassObj.status = value;
            }
        },
    }
});