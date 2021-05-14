// patch用来渲染和更新视图
export function patch(oldVnode, vnode){
  // 判断驶入的oldVnode是否是一个真实元素
  // 初次渲染 传入的vm.$el就是咱们传入的el选项， 所以是真实的dom
  // 如果不是初次渲染而是视图更新的时候 vm.$el就被替换成了更新之前的虚拟dom
  const isRealElement = oldVnode.nodeType
  if(isRealElement) {
    // 初次渲染逻辑
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    // 将虚拟dom转化成真实dom节点
    let el = createElm(vnode)
    //插入到 老的el节点下一个节点的前面  相当于插入到老的el节点的后面
    parentElm.insertBefore(el, oldElm.nextSibling)
    //删除老的el节点
    parentElm.removeChild(oldVnode)
    return el
  }
}

// 虚拟dom转成真实dom 就是调用原生方法生成dom树
function createElm(vnode){
  let { tag, data, key, children, text } = vnode
  if(typeof tag === "string") {
    vnode.el = document.createElement(tag)
    //解析虚拟dom属性
    updateProperties(vnode)
    // 如果有子节点就递归插入到父节点里面
    children.forEach( child => vnode.el.appendChild(createElm(child)) )
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}
// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el; //真实节点
  for (let key in newProps) {
    // style需要特殊处理下
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}
