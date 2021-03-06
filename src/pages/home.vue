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
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-block padding>
      <f7-row>
        <f7-col width=70 resizable>
          <editor v-model="content" 
            @init="editorInit" 
            lang="python"
            theme="chrome" height="60vh">
          </editor>
        </f7-col>
        <f7-col width=30>
          <perfect-scrollbar v-html="scrollcontent" >
          </perfect-scrollbar>
        </f7-col>
      </f7-row>
      <f7-row>
        <f7-col>
          <f7-input :value="content" 
            @change="loadTextFromFile"
            type='file' 
            accept="text/*.py" />
        </f7-input>
      </f7-col>
      <f7-col v-if="simHasStarted">
        <f7-button raised 
          @click="stopSimulation"
          color="red" raised fill>
          Stop
        </f7-button>
      </f7-col>
      <f7-col v-else>
        <f7-button raised  fill
          tooltip="Submit to server"
          :disabled="content.length == 0"
          @click="startSimulation">
          Submit
        </f7-button>
      </f7-col>
    </f7-row>

    <f7-row>
      <!-- Result browser -->
      <div v-if="images.length > 0">
        <f7-photo-browser :photos="images" type="popup" ref="results">
        </f7-photo-browser>
      </div>
    </f7-row>
    <f7-row>
      <!-- progress bar -->
      <f7-progressbar :progress="currentProgress" color=red
        v-if="currentProgress >= 0.0">
      </f7-progressbar>
    </f7-row>
  </f7-block>

  <f7-block-footer style="padding-bottom:5px;padding-top:10px">
    <f7-row>
      <f7-item v-html="$store.getters.server.url" class="col-25">
      </f7-item>
      <f7-item v-html="mooseStatus.MOOSE_STATUS"  
        @click="toggleStatusFetching" class="col-25">
      </f7-item>
    </f7-row>
  </f7-block-footer>

  </f7-page>
</template>

<script>
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      content: '',
      scrollcontent: '<h4>Logs ....</h4>',
      images: [],
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
    const app = self.$f7;

    app.dialog.preloader("Pinging MOOSE server");
    self.getRequest('/ping').then(function(x) {
      console.log(x.data, 'status');
      self.notify("Success", x.data);
      app.dialog.close();
    });
    setTimeout(() => app.dialog.close(), 60*1000);
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
      if(! self.content) {
        console.log("Empty file");
        return;
      }

      self.simHasStarted = true;
      self.currentProgress = 0.0;

      // app.preloader.show();

      self.postRequest('/run/file', {content: self.content}).then(res => { 
        if(res.data.status === 'finished') {

          self.images = [];
          self.scrollcontent += res.data.output.replace('\n', '<br/>');

          res.data.images.forEach((x, k) => {
            //console.log('x', x);
            let html = "<img src='data:image/png;base64, "+x+"' />";
            self.images.push({html: html});
          });

          self.currentProgress = 100;
          //self.notify("Finished", "Simualtion is over");
          //app.preloader.hide();
          var msg = "Simualtion over in "+res.data.time+" sec.";
          if(self.images.length > 0) {
            msg += " Open images?";
          }
          app.dialog.confirm(msg, "MOOSE", function() {
              self.currentProgress = -1.0;
              self.$refs.results.open();
            }, null);
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
