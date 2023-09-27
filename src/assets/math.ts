const ratio = function (w: number, h: number) {
    if (w == h) {
        return [1, 1];
    } else if (w > h) {
        return [toFixedRemore0(w / h), 1];
    } else {
        return [1, toFixedRemore0(h / w)];
    }
}
const toFixedRemore0 = function (num: number, fixed = 2) {
    return parseFloat(num.toFixed(fixed).toString().replace(/\.?0+$/, ''));
}

const calculateAge = function (_birthday: string) {
    const birthday = new Date(_birthday);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/*
*给定给定的纵横比计算图像的新尺寸：
*/
const calculateResizedDimensions = function (originalWidth: number, originalHeight: number, desiredWidth: number, desiredHeight: number) {
    const aspectRatio = originalWidth / originalHeight;
    const desiredAspectRatio = desiredWidth / desiredHeight;
    let resizingFactor;
    if (aspectRatio > desiredAspectRatio) {
        resizingFactor = desiredWidth / originalWidth;
    } else {
        resizingFactor = desiredHeight / originalHeight;
    }
    const newWidth = originalWidth * resizingFactor;
    const newHeight = originalHeight * resizingFactor;
    return { width: Math.floor(newWidth), height: Math.floor(newHeight) };
}

export { ratio, toFixedRemore0, calculateAge, calculateResizedDimensions }