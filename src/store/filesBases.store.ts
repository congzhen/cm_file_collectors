import { defineStore } from "pinia";
import { IfilesBases } from "@/dataInterface/databases.interface"
import { filesBasesServerData } from "@/serverData/filesBases.serverData"
import { filesRelatedPerformerBasesStore } from "@/store/filesRelatedPerformerBases.store";
export const filesBasesStore = defineStore('filesBases', {
    state: () => ({
        currentFilesBases: {} as IfilesBases,
        filesBasesList: [] as Array<IfilesBases>,
    }),
    getters: {
        getCurrentFilesMainPerformerBasesId: function (state) {
            return filesRelatedPerformerBasesStore().getFilesMainPerformerBasesId(state.currentFilesBases.id);
        },
        getFilesBasesById: function (state) {
            return (id: string): IfilesBases | undefined => {
                for (const key in state.filesBasesList) {
                    if (state.filesBasesList[key].id == id) {
                        return state.filesBasesList[key];
                    }
                }
                return undefined;
            }
        },
    },
    actions: {
        init: async function (_currentFilesBases_id: string | undefined = undefined) {
            this.filesBasesList = await filesBasesServerData.getDataList();
            if (this.filesBasesList.length > 0) {
                if (_currentFilesBases_id == undefined) {
                    this.currentFilesBases = this.filesBasesList[0];
                } else {
                    for (const filesBases of this.filesBasesList) {
                        if (filesBases.id == _currentFilesBases_id) {
                            this.currentFilesBases = filesBases;
                            break;
                        }
                    }
                }
            }
        },
        setStatus: function (id: string, status: boolean) {
            for (const key in this.filesBasesList) {
                if (this.filesBasesList[key].id == id) {
                    this.filesBasesList[key].status = status;
                }
            }
        },
    }
});