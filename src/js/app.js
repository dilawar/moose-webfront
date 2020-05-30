// Import Vue
import Vue from 'vue';

import store from './store.js'

// Import Framework7
import Framework7 from './framework7-custom.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import Framework7 Styles
import '../css/framework7-custom.less';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// mixin
Vue.mixin({
   data: function() {
      return {
        tempA: '',
      }
   },
   methods: {
      // available in all components.
      getRequest: function(endpoint) {
         const self = this;
         const app = self.$f7;
         let url = self.$store.getters.server.url;
         let x  = app.request.promise.json(url + '/'+endpoint).then( x => {
            self.$store.commit('MOOSE_STATUS', x.data.MOOSE_STATUS);
         });
      },
   },
});

// Init App
export default new Vue({
   el: '#app',
   store: store,
   render: (h) => h(App),

   // Register App Component
   components: {
      app: App,
   },
});
