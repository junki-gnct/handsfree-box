<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import * as SessionManager from '../SessionManager';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  mounted() {
    if (!SessionManager.isLoggedIn()) {
      this.$router.push({ path: '/login' });
      return;
    }
  }
}
</script>
