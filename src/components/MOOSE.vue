<template>
  <v-container>

    <div class="">
      <v-row class="text-center" v-if="moose_about.version">
        <v-icon>fa fa-toggle-on fa-1x</v-icon> MOOSE is alive.
        Version {{moose_about.version}} / {{moose_status}}.
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
        <perfect-scrollbar @ps-scroll-y="scrollHandle" ref="scroll">
          Logs:
          </perfect-scrollbar>
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

    <v-dialog v-model="loading" fullscreen>
      <v-container fluid fill-height 
        style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular
            :progress="progress"
            color="primary">
            {{progress}}
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>

  </v-container>
</template>

<script>
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
export default {
  name: 'MOOSE',
  data: () => ({
    content: '',
    loading: false,
    progress: 0,
    moose_about: {},
    moose_status: 'UNKNOWN',
    //server_ip : 'http://162.241.114.222:31417',
    server_ip : 'http://192.168.1.8:31417',
  }),
  mounted: function() {
    const self = this;
    console.log('Mounted. Check if MOOSE is alive.');
    // connect to server.
    self.axios.get(self.server_ip+'/about').then(function(x) {
      self.moose_about = x.data;
    });

    // Query MOOSE status every second.
    setInterval( () =>  function() {
      self.axios.get(self.server_ip+'/status').then(function(x) {
        let res = x.data;
        self.moose_status = res.MOOSE_STATUS;
        if(self.moose_status === 'RUNNING') {
          self.progress = parseFloat(res.MOOSE_CURRENT_TIME) 
            / parseFloat(res.MOOSE_RUNTIME) * 100;
          console.log('P', self.progress);
        }
      })}, 5000);
  },
  components: {
    editor : require('vue2-ace-editor'),
    PerfectScrollbar,
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
      console.log('evt', evt);
    },
    submitFile: function() {
      const self = this;
      self.loading = true;
      self.progress = 0;
      this.axios.post(self.server_ip + '/run/file', {content: self.content})
        .then(function(x) {
          console.log('run', x.data);
          console.log(self.$refs.scroll);
          self.loading = false;
        });
    },
  },
}
</script>
