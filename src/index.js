import Vue from './vue'
Vue.mixin({
  created() {
    console.log("我是全局混入");
  },
});

// Vue实例化
let vm = new Vue({
  el: "#app",
  data() {
    return {
      a: { a: { a: { b: 456 } } },
      aa: 1,
      bb: 2,
    };
  },
  created() {
    console.log("我是自己的");
  },
  template: `<div id="a">hello 这是bbbhh我自己写的Vue{{name}}
          </div>`,
});