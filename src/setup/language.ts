import { createI18n } from 'vue-i18n'
import zhCnfrom from '../language/zhCn'
const i18nMessage = {
    zhCn: zhCnfrom
}
const i18n = createI18n({
    globalInjection: true,
    locale: 'zhCn',
    messages: i18nMessage,
    legacy: false
})
export default i18n