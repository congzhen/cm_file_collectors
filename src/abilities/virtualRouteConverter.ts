import path from "path";
import { filesBasesSettingStore } from "@/store/filesBasesSetting.store"

export default (routeSrc: string): string => {
    const baseSetting = filesBasesSettingStore();
    if (baseSetting.config.routeConversion.length == 0) {
        return routeSrc;
    }
    for (const route of baseSetting.config.routeConversion) {
        if (route.from != '' && routeSrc.includes(route.from)) {

            if (route.to.includes('SoftwareDrive:')) {
                return routeSrc.replace(route.from, route.to.replace('SoftwareDrive:\\', path.parse(__dirname).root));
            } else {
                return routeSrc.replace(route.from, route.to);
            }

        }
    }
    return routeSrc;
}