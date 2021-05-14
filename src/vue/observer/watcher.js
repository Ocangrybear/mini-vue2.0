import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler"
// 全局变量id 每次new Watcher都是自增
let id = 0
export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb // 回调函数 比如在watcher更新之前可以执行 beforeUpDate方法
    this.options = options  // 额外的选项  true代表渲染 watcher
    this.id = id++ //watcher的唯一标识
    this.deps = []
    this.depsId = new Set()  // 用来去重dep
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn
    }
    // 实例化就会默认使用get方法
    this.get()
  }
  get() {
    pushTarget(this) // 在调用方法之前 先把当前watcher实例推到全局Dep.target上
    this.getter() // 如果watcher是渲染 watcher 那么就相当于执行 vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    popTarget()
  }
  
  //  把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id
    if(!this.depsId.has(id)){
      this.depsId.add(id)
      this.deps.push(dep)
      // 直接调用dep的addSub方法 吧自己wwatcher添加到dep的subs容器里
      dep.addSub(this)
    }
  }
  
  update() {
    // 每次watcher进行更新的时候  是否可以让他们先缓存起来  之后再一起调用
    // 异步队列机制
    queueWatcher(this);
  }
  run() {
    this.get()
  }
}