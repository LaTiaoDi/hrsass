import { login } from "@/api/user";
import * as Storage from "@/utils/auth";
const state = {
  token: Storage.getToken()
};
const mutations = {
  setToken(state, token) {
    state.token = token;
    Storage.setToken(token);
  }
};
const actions = {
  async login(context, data) {
    const result = await login(data);

    context.commit("setToken", result);
  }
};

export default {
  namespaced: true,
  state,
  mutations,

  actions
};
