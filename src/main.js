import Vue from 'vue'

// import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/styles/common.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as THREE from 'three'
Vue.use(THREE)
import iconfont from '@/font/iconfont.json';
import '@/font/iconfont.css'
import '@/font/iconfont.js'
import 'e-icon-picker/dist/symbol.js'; // 基本彩色图标库
import 'e-icon-picker/dist/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; // element-ui 图标库

import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import waves from '@/directive/waves/index' // 水波纹效果
Vue.use(waves)

import { EIcon, analyzingIconForIconfont } from 'e-icon-picker'
import eIconPicker from 'e-icon-picker';
const forIconfont = analyzingIconForIconfont(iconfont);
Vue.use(EIcon);
Vue.use(eIconPicker, {
    FontAwesome: true,
    ElementUI: true,
    eIcon: true,
    eIconSymbol: false,
    addIconList: forIconfont.list,
    removeIconList: []
})

import * as filters from './filters' // global filters

Vue.use(Element, {
    size: 'medium ' // set element-ui default size
});

Element.Dialog.props.closeOnClickModal.default = false;

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 引入图片查看器
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app')