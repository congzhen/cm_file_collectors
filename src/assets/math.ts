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

export { ratio, toFixedRemore0, calculateAge }