import { defineStore } from "pinia";
import { Itag } from "@/dataInterface/tag.interface"
import { tagServerData } from "@/serverData/tag.serverData"
import { tagClassStore } from "./tagClass.store";

export const tagStore = defineStore('tag', {
    state: () => ({
        tagList: [] as Array<Itag>,
    }),
    getters: {
        getTagListByCurrentFilesBases: function (state) {
            const CurrentFilesBasesTagClassIdArr = tagClassStore().getTagClassListByCurrentFilesBases.map(tagClassItem => tagClassItem.id);
            return state.tagList.filter(tagItem => {
                if (CurrentFilesBasesTagClassIdArr.includes(tagItem.tagClass_id)) {
                    return true;
                }
                return false;
            })
        },
        getTagListByTagClassId: function (state) {
            return (tagClass_id: string, statusMode: 'ALL' | 1 = 1): Array<Itag> => {
                return state.tagList.filter(item => {
                    if (item.tagClass_id == tagClass_id) {
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
        getTagById: function (state) {
            return (id: string): Itag | undefined => {
                for (const key in state.tagList) {
                    if (state.tagList[key].id == id) {
                        return state.tagList[key];
                    }
                }
                return undefined;
            }
        },
        tagExist: function (state) {
            return (id: string) => {
                for (let i = 0; i < state.tagList.length; i++) {
                    if (state.tagList[i].status && state.tagList[i].id == id) {
                        return tagClassStore().tagClassExist(state.tagList[i].tagClass_id);
                    }
                }
                return false;
            }
        }
    },
    actions: {
        init: async function () {
            this.tagList = await tagServerData.getDataList();
        },
        edit: function (id: string, name: string, tagClassId: string) {
            const tagObj = this.getTagById(id);
            if (tagObj) {
                tagObj.name = name;
                tagObj.tagClass_id = tagClassId;
            }
        },
        setStatus: function (id: string, value: boolean) {
            const tagObj = this.getTagById(id);
            if (tagObj) {
                tagObj.status = value;
            }
        },
        delete: function (id: string) {
            this.tagList = this.tagList.filter(obj => obj.id !== id);
        },
    }
});