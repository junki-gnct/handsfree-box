<template>
  <v-app>
    <Header :hidden="hidden" />
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
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Header from './components/Header.vue';
import * as SessionManager from './SessionManager';

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  @Prop({ default: false })
  hidden!: boolean;

  @Watch('$route')
  route() {
    this.hidden = !SessionManager.isLoggedIn();
  }
}
</script>
