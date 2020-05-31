<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">

      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" 
          icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>MOOSE</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu"
          icon-md="material:menu" panel-open="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- progress bar -->
    <f7-progressbar :progress="currentProgress" color=red 
      v-if="currentProgress>=0">
    </f7-progressbar>

    <!-- Page content-->
    <f7-list media-list media-list>
      <f7-list-item>
        <editor v-model="content" 
          @init="editorInit" 
          lang="python"
          theme="chrome" 
          width="100%" 
          height="50vh">
        </editor>
      </f7-list-item>
      <f7-list-input type="file" 
        label="Load model"
        :value="content"
        @change="loadTextFromFile"
        inline-label>
      </f7-list-input>


      <f7-list-item>
        <f7-button raised 
          @click="stopSimulation"
          color="red" raised fill
          v-if="simHasStarted"
          slot="title">
          Stop
        </f7-button>
        <f7-button raised  fill
          tooltip="Submit to server"
          :disabled="content === ''"
          @click="startSimulation"
          slot="after">
          Submit
        </f7-button>
      </f7-list-item>
    </f7-list>

    <f7-block-footer style="padding-bottom:10px">
      <f7-list style="list-style-type:none" media-list no-hairlines>
        <f7-row>
          <f7-list-item header="Server" 
            :footer="$store.getters.server.url"
            class="col-50">
          </f7-list-item>
          <f7-list-item header="Status" 
            :footer="mooseStatus.MOOSE_STATUS"  
            @click="toggleStatusFetching"
            class="col-50">
            <!--
            <f7-preloader slot="media" :size="20" color="yellow">
              -->
            </f7-preloader>
          </f7-list-item>
        </f7-row>
      </f7-list>
    </f7-block-footer>

  </f7-page>
</template>

<script>
var bz2 = require('unbzip2-stream');

export default {
  data() {
    return {
      content: '',
      currentProgress: -1.0,
      simHasStarted: false,
      mooseStatus: {'MOOSE_STATUS':'UNKNOWN'},
    }
  },
  components: {
    editor: require('vue2-ace-editor'),
  },
  mounted() {
    const self = this;
    self.mooseStatusFetch();
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')                
      require('brace/mode/python')  //language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/python') //snippet
    },
    loadTextFromFile: function(ev) {
      const self = this;
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => self.content = e.target.result;
      reader.readAsText(file);
    },
    mooseStatusFetch: function() {
      const self = this;

      if(self.mooseStatus !== null) {
        console.log("Already fetching ...");
        clearInterval(self.mooseStatus);
        self.mooseStatus = null;
      }
      self.mooseStatus = setInterval(self.fetchStatus, 10*1000);
    },
    fetchStatus: function() {
      const self = this;
      self.getRequest('status').then(function(x) {
        self.mooseStatus = JSON.parse(x.data);
        /* console.log('moose status', self.mooseStatus); */
        self.$store.commit('MOOSE_STATUS', self.mooseStatus.MOOSE_STATUS);
        if('MOOSE_CURRENT_TIME' in self.mooseStatus) {
          self.currentProgress = 100 * self.mooseStatus.MOOSE_CURRENT_TIME 
            / self.mooseStatus.MOOSE_RUNTIME;
          //console.log('progress', self.currentProgress);
        }
      });
    },
    clearMooseStatusFetch: function() {
      const self = this;
      clearInterval(self.mooseStatus);
      self.mooseStatus = null;
    },
    toggleStatusFetching: function() {
      const self = this;
      if(self.mooseStatus === null)
        self.mooseStatusFetch();
      else
        self.clearMooseStatusFetch();

    },
    startSimulation: function() {
      const self = this;
      const app = self.$f7;
      if(! content) {
        console.log("Empty file");
        return;
      }

      self.simHasStarted = true;
      self.currentProgress = 0.0;

      // app.preloader.show();

      self.postRequest('/run/file', {content: self.content}).then(res => { 
        if(res.data.status === 'finished') {
          let data = Buffer.from(res.data.output, 'base64');
          self.currentProgress = 100;
          //app.preloader.hide();
          app.dialog.alert("Simualtion over. Time taken "+res.data.time+' sec.'
            , "MOOSE"
            , () => self.currentProgress = -1.0
            , null);
          self.simHasStarted = false;
        }
      });

      setTimeout(() => app.preloader.hide(), 10*60*1000);
    },
    stopSimulation: function() {
      const self = this;
      if(! self.simHasStarted)
        return;
      self.postRequest('/run/stop').then(function(x) {
        // app.preloader.hide();
        console.log('stop', x);
      });
    },
  },
}
</script>
