import { login, getUserInfo, getUserDetailById } from "@/api/user";
import * as Storage from "@/utils/auth";

const state = {
  token: Storage.getToken(),
  name: "嘎达赵",
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
};
const mutations = {
  setToken(state, token) {
    state.token = token;
    Storage.setToken(token);
  },
  removeToken(state) {
    state.token = null;
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    //state.userInfo = { ...userInfo }; // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新 ! 脑瘫写法
    state.userInfo = userInfo;
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {};
  }
};
const actions = {
  async login(context, data) {
    const result = await login(data);
    context.commit("setToken", result);
  },
  exit(context) {
    Storage.removeToken();
    context.commit("reomveUserInfo");
    context.commit("removeToken");
  },
  async getUserInfo(context) {
    const result = await getUserInfo(); // 获取返回值
    const baseInfo = await getUserDetailById(result.userId);
    const baseResult = { ...result, ...baseInfo };
    context.commit("setUserInfo", baseResult); // 将整个的个人信息设置到用户的vuex数据中
    return baseResult; // 这里为什么要返回 为后面埋下伏笔
  }
};

export default {
  namespaced: true,
  state,
  mutations,

  actions
};
