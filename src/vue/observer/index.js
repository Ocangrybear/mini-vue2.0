import { arrayMethods } from './array'
import Dep from './dep'
class Observer {
  //观测值
  constructor(value) {
    Object.defineProperty(value, "__ob__", {
      //  值指代的就是Observer的实例
      value: this,
      //  不可枚举
      enumerable: false,
      writable: true,
      configurable: true,
    });
    if(Array.isArray(value)){
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    // 对象上的所有属性进行观测
    let keys = Object.keys(data)
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
  observeArray(items) {
    for(let i = 0; i < items.length; i++) {
      observe(items[i])
    }
  }
}

function defineReactive(data, key, value) {
  let childOb = observe(value)
  // --如果value还是一个对象会继续走一遍defineReactive 层层遍历一直到value不是对象才停止
  //   思考？如果Vue数据嵌套层级过深 >>性能会受影响
  
  let dep = new Dep() // 为每一属性实例化一个Dep
  
  Object.defineProperty(data, key, {
    get() {
      console.log('获取get：', value)
      if (Dep.target) {
        // 如果有watcher  dep 就会保存watcher 同时watcher也会保存dep
        dep.depend()
        if(childOb) {
          // 这里表示 属性的值依然是一个对象 包含数组和对象 childOb指代的就是Observer实例对象  里面的dep进行依赖收集
          // 比如{a:[1,2,3]} 属性a对应的值是一个数组 观测数组的返回值就是对应数组的Observer实例对象
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套  数组包含数组的情况  那么我们访问a的时候 只是对第一层的数组进行了依赖收集 里面的数组因为没访问到  所以五大收集依赖  但是如果我们改变了a里面的第二层数组的值  是需要更新页面的  所以需要对数组递归进行依赖收集
            // 如果内部还是数组
            dependArray(value); // 不停的进行依赖收集
          }
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return;
      console.log('设置set：', newValue)
      // 如果赋值的新值也是一个对象  需要观测
      observe(newValue)
      value = newValue
      dep.notify()  // 通知渲染watcher去更新
    }
  })
}

export function observe(value){
   // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object Object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value)
  }
}
// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    // e.__ob__代表e已经被响应式观测了 但是没有收集依赖 所以把他们收集到自己的Observer实例的dep里面
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      // 如果数组里面还有数组  就递归去收集依赖
      dependArray(e);
    }
  }
}