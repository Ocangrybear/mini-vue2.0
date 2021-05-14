import { initMixin } from "./init.js"
import { lifecycleMixin  } from "./src/lifecycle.js"
import { renderMixin  } from "./src/render.js"

function Vue(options) {
  // vue初始化
  this._init(options)
}


initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue