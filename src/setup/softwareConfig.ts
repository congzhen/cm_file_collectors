import fs from 'fs'
import { createFolder } from './folder'
import config, { setDbPath } from "./config"
interface IsoftWareConfigData {
    [key: string]: string | number | boolean
}
const softWareConfigData: IsoftWareConfigData = {
    serverWanIpWebsite: 'https://ifconfig.me/ip',
    serverPort: 12345,
    autoOpenServer: false,
    serverPassword: '',
    language: 'zhCn',
    dbPath: '',
}

function softwareConfigInit() {
    createFolder(config.configFolderPath);
    const softwareConfigExists = fs.existsSync(config.softwareConfigPath);
    if (softwareConfigExists) {
        getSoftwareConfig();
    } else {
        createAndUpdateSoftwareConfig();
    }
    if (softWareConfigData.dbPath != '') {
        setDbPath(softWareConfigData.dbPath as string);
    }
}

function setSoftWareConfig(objData: IsoftWareConfigData, autoSave = false) {
    for (const key in objData) {
        if (key in softWareConfigData) {
            softWareConfigData[key] = objData[key];
        }
    }
    if (autoSave) {
        createAndUpdateSoftwareConfig();
    }
}

function setSoftWareConfigValue(key: string, value: string | number | boolean, autoSave = false) {
    softWareConfigData[key] = value;
    if (autoSave) {
        createAndUpdateSoftwareConfig();
    }
}

function createAndUpdateSoftwareConfig() {
    const jsonData = JSON.stringify(softWareConfigData, null, 2);
    fs.writeFileSync(config.softwareConfigPath, jsonData);
}

function getSoftwareConfig() {
    const jsonData = fs.readFileSync(config.softwareConfigPath, 'utf8');
    const configJsonData = JSON.parse(jsonData);
    for (const key in softWareConfigData) {
        if (key in configJsonData) {
            softWareConfigData[key] = configJsonData[key];
        }
    }
}

export { softWareConfigData, IsoftWareConfigData, softwareConfigInit, setSoftWareConfig, setSoftWareConfigValue }