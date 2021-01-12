<template>
  <div class="about">
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">This is an about page</h1>
      </v-col>
      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          Related Links
        </h2>

        <v-row justify="center">
          <router-link to="/" class="subheading mx-3">Home</router-link>
          <router-link to="/about" class="subheading mx-3">About</router-link>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as SessionManager from '../SessionManager';

@Component
export default class About extends Vue {
  mounted() {
    if (!SessionManager.isLoggedIn()) {
      this.$router.push({ path: '/login' });
      return;
    }
  }
}
</script>
