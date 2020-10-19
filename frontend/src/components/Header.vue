<template>
  <div>
    <v-app-bar app color="#000033" dark>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon
          v-if="!hidden"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
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
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Application
              </v-list-item-title>
              <v-list-item-subtitle>
                subtext
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  @Prop({ default: false })
  hidden!: boolean;

  private drawer = false;

  private group = null;

  private items = [
    {
      title: 'MEMORY',
      path: '/about',
      icon: 'mdi-view-dashboard',
    },
  ];
}
</script>
