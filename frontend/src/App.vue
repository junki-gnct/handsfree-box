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

<script>
import { Vue, Component } from 'vue-property-decorator';
import Header from './components/Header.vue';
import firebase from 'firebase';

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  created() {
    const messaging = firebase.messaging();
    console.log(process.env.VUE_APP_MIX_FIREBASE_APP_VAPPI_KEY);
    messaging.usePublicVapidKey(process.env.VUE_APP_MIX_FIREBASE_APP_VAPPI_KEY);
  }
}
</script>
