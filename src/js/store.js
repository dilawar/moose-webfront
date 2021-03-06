import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      alreadyLoggedIn: false,
      profile: {},
      apiKeyGMap: '',
      server : {
         url: 'http://162.241.114.222:320',
         // url: 'http://162.241.114.222:31417',
         status: 'UNKNOWN',
      },
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
      server: state => {
         return state.server;
      },
   },
   mutations: {
      USER_LOGGED (state, user) {
         state.user = user;
         state.alreadyLoggedIn = true;
      },
      MOOSE_API_KEY (state, key) {
         state.apikey = key;
      },
      PROFILE(state, data) {
         state.profile = data;
      },
      GOOGLE_MAP_API_KEY(state, key) {
         state.apiKeyGMap = key;
      },
      MOOSE_STATUS(state, val) {
         state.server.status = val;
      },
      MOOSE_URL(state, val) {
         state.server.url = val;
      },
   },
});
