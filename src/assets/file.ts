import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { coreCreateGuid } from '@/core/coreGuid';


const filePath = function (path: string, name: string) {
    checkFolderAndMkdir(path);
    return path + name;
}

const getFileName = function (filePath: string) {
    return path.basename(filePath);
}


const existsFile = function (filePath: string) {
    return fs.existsSync(filePath);
}

const checkFolderAndMkdir = function (folderPath: string) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

const saveBase64Picture = function (fileData: string, path: string, name: string | undefined = undefined, postfix = 'jpg') {
    if (name == undefined) {
        name = coreCreateGuid() + '.' + postfix;
    }
    fileData = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(fileData, 'base64');
    const filePathStr = filePath(path, name);
    fs.writeFileSync(filePathStr, buffer);
    return {
        folderPath: path,
        fileName: name,
        filePath: filePathStr,
    };
}

const fileMove = function (filePath: string, moveTo: string) {
    if (fs.existsSync(filePath)) {
        checkFolderAndMkdir(path.dirname(moveTo));
        fs.renameSync(filePath, moveTo);
    }
}

const fileCopy = function (filePath: string, copyTo: string) {
    if (fs.existsSync(filePath)) {
        checkFolderAndMkdir(path.dirname(copyTo));
        fs.copyFileSync(filePath, copyTo);
    }
}

const deleteFile = function (path: string, name: string) {
    let status: boolean;
    try {
        fs.unlinkSync(filePath(path, name))
        status = true;
    } catch (err) {
        status = false;
    }
    return status;
}

const readDir = function (folderPath: string, _fileExtension: Array<string> = []) {
    if (!fs.existsSync(folderPath)) {
        return [];
    }
    const files = fs.readdirSync(folderPath);
    if (_fileExtension.length == 0) {
        return files;
    }
    const fileExtension = _fileExtension.map(ext => {
        if (ext[0] != '.') {
            return '.' + ext;
        }
        return ext;
    })
    return files.filter(file => {
        const theFileExtension = path.extname(file);
        if (fileExtension.includes(theFileExtension.toLocaleLowerCase())) {
            return file;
        }
    });
}


interface EfileImageInfo {
    src: string;
    name: string;
    format: string;
    density: number;
    width: number;
    height: number;
}

const readDirImage = async function (folderPath: string) {
    const imageInfoList: Array<EfileImageInfo> = [];
    const imageList = readDir(folderPath, ['jpg', 'jpeg', 'png', 'gif']);
    for (const fileName of imageList) {
        const src = path.join(folderPath, fileName);
        const metadata = await sharp(src).metadata();
        imageInfoList.push({
            src,
            name: fileName,
            format: metadata.format,
            density: metadata.density,
            width: metadata.width,
            height: metadata.height,
        } as EfileImageInfo);
    }
    return imageInfoList;
}


export { saveBase64Picture, fileMove, fileCopy, deleteFile, existsFile, getFileName, readDir, readDirImage, EfileImageInfo }
