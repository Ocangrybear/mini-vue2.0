import { nextTick } from "../util/next-tick"
let queue = []
let has = {}
function flushSchedulerQueue() {
  for(let i = 0; i < queue.length; i++) {
    queue[i].run()
  }
  //执行完后清空队列
  queue = []
  has = {}
}

//实现异步队列机制
export function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] === undefined){
    //  同步代码执行 把全部的watcher都放到队列里面去
    queue.push(watcher);
    has[id] = true;
    // 进行异步调用
    nextTick(flushSchedulerQueue);
  }
}