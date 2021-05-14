let arrayProto = Array.prototype

export const arrayMethods = Object.create(arrayProto)

let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort"
]

methodsToPatch.forEach( method => {
  arrayMethods[method] = function(...args) {
    // 保留原型方法执行结果
    let result = arrayProto[method].apply(this, args)
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__
    
    // 这里标志着代码有新增操作
    let inserted
    switch(method) {
      case "push":
      case "unshift":
        inserted = args
        break;
      case "splice":
        inserted = args.slice(2)
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    ob.dep.notify(); //数组派发更新 ob指的就是数组对应的Observer实例 我们在get的时候判断如果属性的值还是对象那么就在Observer实例的dep收集依赖 所以这里是一一对应的  可以直接更新
    console.log("执行了数组代理方法", args)
    return
  }
})