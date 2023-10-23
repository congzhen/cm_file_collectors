import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import dataset from '@/assets/dataset'
import { coreCreateGuid } from '@/core/coreGuid';
import { calculateResizedDimensions } from './math';


const suffixNameArrayConversion = (arr: Array<string>) => {
    return arr.map(ext => {
        if (ext[0] != '.') {
            return '.' + ext.toLocaleLowerCase();
        }
        return ext.toLocaleLowerCase();
    })
}

const checkSuffixName = (suffixName: string, suffixArr: Array<string>) => {
    return suffixArr.includes(suffixName.toLocaleLowerCase())
}


const isDirectory = (folderPath: string) => {
    return fs.statSync(folderPath).isDirectory();
}

const isVideo = (filePath: string) => {
    return dataset.videoSuffixName.includes(path.extname(filePath).toLowerCase());
}

const filePath = function (_path: string, name: string) {
    checkFolderAndMkdir(_path);
    return path.join(_path, name);
}

const getFileName = function (filePath: string) {
    return path.basename(filePath);
}
const getFolderPath = function (filePath: string) {
    return path.dirname(filePath);
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

const deleteFile = function (folderPath: string, name: string) {
    let status: boolean;
    try {
        fs.unlinkSync(path.join(folderPath, name))
        status = true;
    } catch (err) {
        status = false;
    }
    return status;
}
const deleteFolderRecursive = function (folderPath: string) {
    try {
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file) => {
                const currentPath = path.join(folderPath, file);
                if (fs.lstatSync(currentPath).isDirectory()) {
                    deleteFolderRecursive(currentPath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
            fs.rmdirSync(folderPath);
        }
    } catch (err) {
        console.log(err)
    }

}

/**
 * 读取文件夹中的文件
 * @param folderPath 
 * @param _fileExtension 
 * @returns 
 */
const readDir = function (folderPath: string, _fileExtension: Array<string> = []) {
    if (!fs.existsSync(folderPath)) {
        return [];
    }
    const files = fs.readdirSync(folderPath);
    if (_fileExtension.length == 0) {
        return files;
    }
    const fileExtension = suffixNameArrayConversion(_fileExtension);
    return files.filter(file => {
        const theFileExtension = path.extname(file);
        if (checkSuffixName(theFileExtension, fileExtension)) {
            return file;
        }
    });
}
/**
 * 深层读取文件夹中的文件，包括了子文件夹
 * @param folderPath 
 * @param _fileExtension 
 * @returns 
 */
const readDirDeep = async function (directory: string, _fileExtension: Array<string> = []) {
    const fileExtension = suffixNameArrayConversion(_fileExtension);
    const files = await fs.promises.readdir(directory, { withFileTypes: true });
    const nfoFiles: string[] = [];
    for (const file of files) {
        const filePath = path.join(directory, file.name);
        if (file.isDirectory()) {
            nfoFiles.push(...await readDirDeep(filePath, _fileExtension));
        } else if (_fileExtension.length === 0 || checkSuffixName(path.extname(file.name), fileExtension)) {
            nfoFiles.push(filePath);
        }
    }

    return nfoFiles;
}


interface EfileImageInfo {
    src: string;
    name: string;
    format: string;
    density: number;
    width: number;
    height: number;
    thumbnail?: string;
}

const readfileImageInfo = async function (folderPath: string, fileName: string, thumbnail = false, thumbnailWidth = 100, thumbnailHeight = 100) {
    const src = path.join(folderPath, fileName);
    const metadata = await sharp(src).metadata();
    const obj = {
        src,
        name: fileName,
        format: metadata.format,
        density: metadata.density,
        width: metadata.width,
        height: metadata.height,
    } as EfileImageInfo
    if (thumbnail && obj.width > thumbnailWidth && obj.height > thumbnailHeight) {
        const { width, height } = calculateResizedDimensions(obj.width, obj.height, thumbnailWidth, thumbnailHeight);
        const buffer = await sharp(src).resize(width, height).toBuffer();
        obj.thumbnail = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
    return obj;
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


export { isDirectory, isVideo, checkFolderAndMkdir, saveBase64Picture, fileMove, fileCopy, deleteFile, deleteFolderRecursive, existsFile, getFileName, getFolderPath, readDir, readDirDeep, readfileImageInfo, readDirImage, EfileImageInfo }
