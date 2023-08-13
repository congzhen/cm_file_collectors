import { defineStore } from "pinia";
import { IfilesRelatedPerformerBases } from "@/dataInterface/databases.interface"
import { filesRelatedPerformerBasesServerData } from "@/serverData/filesRelatedPerformerBases.serverData"
export const filesRelatedPerformerBasesStore = defineStore('filesRelatedPerformerBases', {
    state: () => ({
        filesRelatedPerformerBasesList: [] as Array<IfilesRelatedPerformerBases>
    }),
    getters: {
        getFilesPerformerBasesRelatedList: function (state) {
            return (filesBases_id: string) => {
                const arr: Array<IfilesRelatedPerformerBases> = [];
                state.filesRelatedPerformerBasesList.forEach((relatedInfo: IfilesRelatedPerformerBases) => {
                    if (relatedInfo.filesBases_id == filesBases_id) {
                        arr.push(relatedInfo);
                    }
                })
                return arr;
            }
        },
        getFilesPerformerBasesRelatedPerformerIdArr: function () {
            return (filesBases_id: string) => {
                const relatedList = this.getFilesPerformerBasesRelatedList(filesBases_id);
                const arr: Array<string> = [];
                relatedList.forEach((item: IfilesRelatedPerformerBases) => {
                    arr.push(item.performerBases_id);
                })
                return arr;
            }
        },
        getPerformerFilesBasesRelatedList: function (state) {
            return (performerBases_id: string) => {
                const arr: Array<IfilesRelatedPerformerBases> = [];
                state.filesRelatedPerformerBasesList.forEach((relatedInfo: IfilesRelatedPerformerBases) => {
                    if (relatedInfo.performerBases_id == performerBases_id) {
                        arr.push(relatedInfo);
                    }
                })
                return arr;
            }
        },
        getPerformerFilesBasesRelatedPerformerIdArr: function () {
            return (performerBases_id: string) => {
                const relatedList = this.getPerformerFilesBasesRelatedList(performerBases_id);
                const arr: Array<string> = [];
                relatedList.forEach((item: IfilesRelatedPerformerBases) => {
                    arr.push(item.filesBases_id);
                })
                return arr;
            }
        },
        getFilesMainPerformerBasesId: function (state) {
            return (filesBases_id: string): string | undefined => {
                for (const key in state.filesRelatedPerformerBasesList) {
                    if (state.filesRelatedPerformerBasesList[key].filesBases_id == filesBases_id && state.filesRelatedPerformerBasesList[key].main) {
                        return state.filesRelatedPerformerBasesList[key].performerBases_id;
                    }
                }
                return undefined;
            }
        },

    },
    actions: {
        init: async function () {
            this.filesRelatedPerformerBasesList = await filesRelatedPerformerBasesServerData.getDataList();
        },
    }
});