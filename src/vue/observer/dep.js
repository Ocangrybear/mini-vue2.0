// dep 和 watch是多对多的关系
// 每个属性都有自己的dep

let id = 0;
export default class Dep {
  constructor() {
      this.id = id++
      this.subs = []
  }
  depend() {
    // 如果当前存在watcher
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  
  notify() {
    this.subs.forEach( watcher => watcher.update())
  }
  
  addSub(watcher) {
    this.subs.push(watcher)
  }
}
// 默认 Dep。target为null
Dep.target = null

const targetStack = []

export function pushTarget(watcher) {
  targetStack.push(watcher);
  Dep.target = watcher; // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop(); // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1];
}