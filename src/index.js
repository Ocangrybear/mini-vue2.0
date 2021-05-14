import Vue from './vue'
// Vue实例化
let vm = new Vue({
  el: "#app",
  data() {
    return {
      a: 123,
    };
  },
  // render(h) {
  //   return h('div',{id:'a'},'hello')
  // },
  template: `<div id="a">hello {{a}}</div>`,
});

  // 我们在这里模拟更新
setInterval(() => {
  vm.a += vm.a;
  // 此方法是刷新视图的核心
}, 1000);
