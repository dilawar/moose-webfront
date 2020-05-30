<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>MOOSE</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-block>
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
          <f7-button raised tooltip="Submit to server"
            slot="after">Submit</f7-button>
        </f7-list-item>
      </f7-list>
    </f7-block>

    <f7-block-footer style="padding-bottom:10px">
      <f7-list style="list-style-type:none" media-list no-hairlines>
        <f7-row>
          <f7-list-item header="Server" 
            :footer="$store.getters.server.url"
            class="col-50">
          </f7-list-item>
          <f7-list-item header="Status" 
            :footer="$store.getters.server.status"  
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
export default {
  data() {
    return {
      content: '',
      mooseStatus: null,
    }
  },
  components: {
    editor: require('vue2-ace-editor'),
  },
  mounted() {
    const self = this;
    self.enableMooseStatusFetch();
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
    enableMooseStatusFetch: function() {
      const self = this;
      if(self.mooseStatus !== null)
        return;

      self.mooseStatus = setInterval( x => self.getRequest('/status'), 10000);

    },
  },
}
</script>
