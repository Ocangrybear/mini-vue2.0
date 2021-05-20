import { initMixin } from "./init.js"
import { initGlobalAPI } from "./global-api/index"
import { lifecycleMixin  } from "./src/lifecycle.js"
import { renderMixin  } from "./src/render.js"

function Vue(options) {
  // vue初始化
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)
export default Vue