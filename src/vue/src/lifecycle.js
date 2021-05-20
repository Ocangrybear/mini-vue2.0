import { patch } from '../vdom/patch'
import Watcher from '../observer/watcher'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  // 上一步，模板编译解析了render函数
  // 下一步就是执行 vm._render()方法，调用render函数，生成虚拟dom
  // 最后使用vm._update()方法把虚拟dom渲染到页面
  
  // 真实的el选项赋值给实例的$el属性 为之后虚拟dom产生的新的dom替换老的dom做铺垫
  vm.$el = el
  callHook(vm, "beforeMount"); //初始渲染之前
  // _update和 _render 方法都是挂载在Vue原型的方法  类似_init
  // vm._update(vm._render())
  
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, () => {
    callHook(vm, "beforeUpdate"); //更新之前
  }, true)
  callHook(vm, "mounted"); //渲染完成之后
}

export function callHook(vm, hook) {
  // 依次执行生命周期对应的方法
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); //生命周期里面的this指向当前实例
    }
  }
}