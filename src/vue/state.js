import { observe } from "./observer/index.js"

//初始化状态 注意顺序  data里面是否可以直接使用prop的值 为什么

//prop > methods> data > computed > watch
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options
  if(opts.props) {
    initProps(vm)
  }
  if(opts.methods) {
    initMethod(vm)
  }
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }
}


// 初始化 data数据

function initData(vm) {
  let data = vm.$options.data
  // 实例的data属性就是传入的data
  // vue组件的data推荐使用函数  放置数据在组件之间共享
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {}
  // 把data数据代理到 vm 也就是 vue实例上面  我们可以使用this.a 来访问this._data.a
  for(let key in data) {
    proxy(vm, '_data', key)
  }
  // 对数据进行观察， 响应式数据核心
  observe(data)
}

// 数据代理
function proxy(object, sourceKey, key){
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key]
    },
    set(newValue) {
      object[sourceKey][key] = newValue
    }
  })
} 