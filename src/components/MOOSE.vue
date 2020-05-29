<template>
  <v-container>

    <div class="">
      <v-row class="text-center" v-if="moose_about.version">
        <v-icon>fa fa-toggle-on fa-1x</v-icon> MOOSE is alive.
         Version {{moose_about.version}}
      </v-row>
      <v-row v-else>
        <v-icon> fa fa-circle-notch fa-spin</v-icon>
        Pining MOOSE server 
      </v-row>
    </div>

    <v-row class="text-center">
      <v-col cols=6>
        <editor v-model="content" @init="editorInit"
          lang="python"
          width="500"
          height="200" >
        </editor>
      </v-col>
      <v-col cols=6>
        <VuePerfectScrollbar class="scroll-area" v-once
          @ps-scroll-y="scrollHandle">
          </VuePerfectScrollbar>
        </v-col>
    </v-row>
    <v-row>
      <v-col>
        <label class="text-reader">
          <input type="file" @change="loadTextFromFile">
        </label>
      </v-col>
      <v-col>
        <v-btn @click="submitFile">Submit</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar/index.vue'
export default {
  name: 'MOOSE',
  data: () => ({
    content: '',
    moose_about: {},
    server_ip : 'http://162.241.114.222:31417',
  }),
  mounted: function() {
    const self = this;
    console.log('Mounted. Check if MOOSE is alive.');

    // connect to server.
    self.axios.get(self.server_ip+'/about').then(function(x) {
      // console.log(111, x.data);
      self.moose_about = x.data;
    });
  },
  components: {
    editor : require('vue2-ace-editor'),
    VuePerfectScrollbar,
  },
  methods: {
    loadTextFromFile: function(ev) {
      const self = this;
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        //console.log(e.target.result);
        self.content = e.target.result;
      };
      reader.readAsText(file);
    },
    editorInit: function() {
      require('brace/ext/language_tools')
      require('brace/mode/html')     
      require('brace/mode/python')  
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/python') 
    },
    scrollHandle: function(evt) {
      console.log(evt);
    },
    submitFile: function() {
      const self = this;
      self.axios.post(self.server_ip + '/run/file', self.content)
        .then(function(x) {
          console.log('run', x.data);
        });
    },
  },
}
</script>
