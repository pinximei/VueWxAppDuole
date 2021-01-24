import Vue from 'vue';
import VueI18n from 'vue-i18n'

import zh from './lang_zh.js'
import en from './lang_eh.js'

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale:'zh',
    messages:{
        zh,
        en
    }
});
export default i18n;