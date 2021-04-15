import PageTools from "./pageTools";
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component("PageTools", PageTools);
  }
};
