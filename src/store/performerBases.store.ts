import { defineStore } from "pinia";
import { IperformerBases } from "@/dataInterface/databases.interface"
import { performerBasesServerData } from "@/serverData/performerBases.serverData"
import { filesBasesStore } from "./filesBases.store";
import { filesRelatedPerformerBasesStore } from "./filesRelatedPerformerBases.store";
export const performerBasesStore = defineStore('performerBases', {
    state: () => ({
        performerBasesList: [] as Array<IperformerBases>
    }),
    getters: {
        getFirstFilesBases: function (state): IperformerBases {
            if (state.performerBasesList.length > 0) {
                return state.performerBasesList[0];
            }
            return {} as IperformerBases;
        },
        getPerformerBasesListByCurrentFilesBases: function (state) {
            const idArr = filesRelatedPerformerBasesStore().getFilesPerformerBasesRelatedPerformerIdArr(filesBasesStore().currentFilesBases.id);
            return state.performerBasesList.filter(p => idArr.includes(p.id) && p.status);
        },
        getPerformerBasesById: function (state) {
            return (performerBases_id: string): IperformerBases | undefined => {
                for (const key in state.performerBasesList) {
                    if (state.performerBasesList[key].id == performerBases_id) {
                        return state.performerBasesList[key];
                    }
                }
                return undefined;
            }
        },
    },
    actions: {
        init: async function () {
            this.performerBasesList = await performerBasesServerData.getDataList();
        },
        setStatus: function (id: string, status: boolean) {
            for (const key in this.performerBasesList) {
                if (this.performerBasesList[key].id == id) {
                    this.performerBasesList[key].status = status;
                }
            }
        },
    }
});