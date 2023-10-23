import path from 'path'
import setupConfig from "@/setup/config"

export const resCoverFolderPath = (filesBases_id: string) => {
    return path.join(setupConfig.resCoverPosterPath, filesBases_id);
}

export const resCoverImageSrc = (filesBases_id: string, coverPoster: string) => {
    return path.join(setupConfig.resCoverPosterPath, filesBases_id, coverPoster);
}


export const performerFaceFolderPath = (performerBases_id: string | undefined) => {
    return path.join(setupConfig.performerFacePath, performerBases_id ? performerBases_id : '/');
}


export const performerFaceImageSrc = (performerBases_id: string | undefined, performerFacePhoto: string) => {
    return path.join(setupConfig.performerFacePath, performerBases_id ? performerBases_id : '/', performerFacePhoto);
}

