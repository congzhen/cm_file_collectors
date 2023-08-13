import { v1, v4 } from 'uuid'
import { customAlphabet } from 'nanoid'

enum ECoreGuidType {
    v1 = 'v1',
    v4 = 'v4',
    nanoid = 'nanoid',
}

function coreCreateGuid(_type = ECoreGuidType.nanoid) {
    let guid: string;
    switch (_type) {
        case ECoreGuidType.v1:
            guid = v1();
            break;
        case ECoreGuidType.v4:
            guid = v4();
            break;
        case ECoreGuidType.nanoid:
        default:
            guid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16)();
    }
    return guid;
}

export { coreCreateGuid, ECoreGuidType }

