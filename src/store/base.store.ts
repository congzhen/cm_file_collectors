import { IresourcesBase } from "@/dataInterface/resources.interface";
import { defineStore } from "pinia";
export const baseStore = defineStore('base', {
    state: () => ({
        batchEditStatus: false,
        batchEditDataList: [] as Array<IresourcesBase>,
    }),
    getters: {
        checkBatchEditDataStatus: function (state: any) {
            return (data: IresourcesBase) => {
                for (const dataItem of state.batchEditDataList) {
                    if (dataItem.id == data.id) {
                        return true;
                    }
                }
                return false;
            }
        },

    },
    actions: {
        addBatchEditData: function (data: IresourcesBase) {
            this.batchEditDataList.unshift(data);
        },
        deleteBatchEditData: function (data: IresourcesBase) {
            this.batchEditDataList.splice(this.batchEditDataList.indexOf(this.batchEditDataList.find((item: IresourcesBase) => item.id === data.id)), 1);
        },
        clearBatchEditData: function () {
            this.batchEditDataList = [];
        },
        setBatchEditStatus: function (status: boolean) {
            this.batchEditStatus = status;
        },

    }
});