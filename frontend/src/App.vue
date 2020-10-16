<template>
  <v-app>
    <Header />
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Header from './components/Header.vue';

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {}
</script>
