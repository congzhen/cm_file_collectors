import pinyin from 'js-pinyin'

function containsNonEnglish(str: string) {
    const reg = /[^A-Za-z0-9\s]/gm; // This regular expression matches any non-English character
    return reg.test(str);
}
function containsChinese(str: string) {
    const reg = /[\u4e00-\u9fa5]/gm; // This regular expression matches any Chinese character
    return reg.test(str);
}

function containsJapanese(str: string) {
    const reg = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/gm; // This regular expression matches any Japanese character
    return reg.test(str);
}

function whetherNeedConvert(str: string) {
    if (containsChinese(str) || containsJapanese(str)) {
        return true;
    }
    return false;
}
function stringConvert(str: string): string {
    return pinyin.getCamelChars(str).toLowerCase()
}

export default function stringSearch(searchVal: string, searchContent: string): boolean {
    searchVal = searchVal.replace(/(^\s*)|(\s*$)/g, '');
    /*
    if (!containsNonEnglish(searchContent)) {
        return (searchContent.indexOf(searchVal) > -1);
    }
   */
    if (searchContent.indexOf(searchVal) > -1) {
        return true;
    }
    if (whetherNeedConvert(searchContent)) {
        searchContent = stringConvert(searchContent)
    }
    return (searchContent.indexOf(searchVal) > -1);
}

function stringIndexChar(str: string) {
    return stringConvert(str)[0];
}

export { stringSearch, stringIndexChar }