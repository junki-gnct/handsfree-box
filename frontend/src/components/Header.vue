<template>
  <div>
    <v-app-bar app color="#000033" dark>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.png')"
          transition="scale-transition"
          width="40"
        />
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary disable-resize-watcher>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item :key="home.title" :value="home.active" :to="home.path">
            <v-list-item-title>{{ home.title }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-for="item in items"
            :key="item.title"
            :value="item.active"
            :to="item.path"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private drawer = false;

  private group = null;

  private home = {
    title: 'HOME',
    path: '/',
    active: true,
  };

  private items = [
    {
      title: 'MEMORY',
      path: '/about',
    },
  ];
}
</script>
