import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      alreadyLoggedIn: false,
      api : 'https://ncbs.res.in/hippo/v1/api',
      // api : 'http://172.16.223.30/hippo/v1/api',
      apikey : localStorage.getItem('MOOSE-API-KEY'),
      apiKeyGMap: '',
      tobook: null,
      profile: {roles:['USER']},
   },
   getters: {
      profile: state => {
         return state.profile;
      },
      login: state => {
         return state.user;
      },
      apikey: state => {
         return state.apikey;
      },
   },
   mutations: {
      USER_LOGGED (state, user) {
         state.user = user;
         state.alreadyLoggedIn = true;
         localStorage.setItem('MOOSE-LOGIN', user);
      },
      MOOSE_API_KEY (state, key) {
         localStorage.setItem('MOOSE-API-KEY', key);
         state.apikey = key;
      },
      PROFILE(state, data) {
         state.profile = data;
      },
      GOOGLE_MAP_API_KEY(state, key) {
         state.apiKeyGMap = key;
      },
   },
});
