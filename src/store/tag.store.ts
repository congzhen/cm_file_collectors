import { defineStore } from "pinia";
import { Itag } from "@/dataInterface/tag.interface"
import { tagServerData } from "@/serverData/tag.serverData"
export const tagStore = defineStore('tag', {
    state: () => ({
        tagList: [] as Array<Itag>,
    }),
    getters: {
        getTagListByTagClassId: function (state) {
            return (tagClass_id: string): Array<Itag> => {
                return state.tagList.filter(item => item.tagClass_id == tagClass_id && item.status);
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
    }
});