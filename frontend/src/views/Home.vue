<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import * as SessionManager from '../SessionManager';
import firebase from 'firebase';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  @Prop({ default: '' })
  GCMKey!: string;

  mounted() {
    if (!SessionManager.isLoggedIn()) {
      this.$router.push({ path: '/login' });
      return;
    }

    const messaging = firebase.messaging();
    console.log(this.GCMKey);
    messaging.usePublicVapidKey(this.GCMKey);

    Notification.requestPermission()
      .then(permission => {
        if (permission == 'granted') {
          return messaging.getToken();
        } else if (permission == 'denied') {
          // TODO: Show alert dialog to home top.
        } else if (permission == 'default') {
          // TODO: Show suggest dialog to home top.
        }
      })
      .then(token => {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            const db = firebase.database();
            const ref = db.ref(`/${user.uid}/token`);
            ref.set(token);
            console.log(`${token}`);
          }
        });
      })
      .catch(err => {
        console.log(`Error occured. ${err}`);
      });
  }
}
</script>
