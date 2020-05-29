<template>
  <v-container>

    <v-row class="text-center">
      <v-col cols=6>
        <editor v-model="cotent" @init="editorInit"
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

  </v-container>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar/index.vue'
export default {
  name: 'Hello MOOSE',
  data: () => ({
    content: '',
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader',
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify',
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify',
      },
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com',
      },
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com',
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify',
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs',
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify',
      },
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com/components/api-explorer',
      },
      {
        text: 'Select a layout',
        href: 'https://vuetifyjs.com/layout/pre-defined',
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      },
    ],
  }),
  components: {
    editor : require('vue2-ace-editor'),
    VuePerfectScrollbar,
  },
  methods: {
    editorInit: function() {
      require('brace/ext/language_tools')
      require('brace/mode/html')     
      require('brace/mode/javascript')  
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') 
    },
  },
}
</script>
