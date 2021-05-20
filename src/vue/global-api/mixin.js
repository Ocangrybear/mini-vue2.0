import {mergeOptions} from '../util/index'
export default function intMixin(Vue){
  Vue.mixin = function (mixin) {
    //   合并对象
    this.options = mergeOptions(this.options = {}, mixin)
  };
}
