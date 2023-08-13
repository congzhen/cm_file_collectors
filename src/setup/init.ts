import i18n from "@/setup/language";
import { folderInit } from "@/setup/folder"
import { softwareConfigInit } from "@/setup/softwareConfig";
import { dbInit } from "@/setup/databases";

import { dbConvertExec } from "@/setup/db_convert"

// eslint-disable-next-line @typescript-eslint/no-empty-function
async function init(Fn = () => { }) {
    softwareConfigInit();
    folderInit();
    await dbInit();
    await dbConvertExec();
    Fn();
}


export { init, i18n }