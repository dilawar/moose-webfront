<template>
  <v-app>
    <v-app-bar app color="primary" dark >
      <div class="d-flex align-center">
        <v-img
          alt="MOOSE Logo"
          class="shrink mr-2"
          contain
          src="https://moose.readthedocs.io/en/master/_static/moose_logo.png"
          transition="scale-transition"
          width="60"
        /> MOOSE
      </div>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/BhallaLab/moose-core/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <moose/>
    </v-content>
  </v-app>
</template>

<script>
import moose from './components/MOOSE';

export default {
  name: 'App',

  components: {
    moose,
  },

  data: () => ({
    //
  }),
};
</script>
