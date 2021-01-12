import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBDvnFMHjLLuOM8Zkl1nTAXTY-xhmKiIYU',
  authDomain: 'handsfree-box.firebaseapp.com',
  databaseURL: 'https://handsfree-box.firebaseio.com',
  projectId: 'handsfree-box',
  storageBucket: 'handsfree-box.appspot.com',
  messagingSenderId: '441504308723',
  appId: '1:441504308723:web:f18579e0d49696071b0686',
  measurementId: 'G-K3C97TTE37',
};

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
