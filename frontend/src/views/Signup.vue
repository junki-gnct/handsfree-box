<template>
  <div class="signup">
    <table>
      <tr>
        <th>メールアドレス：</th>
      </tr>
      <tr>
        <td><input v-model="mailaddress" type="text" /></td>
      </tr>
      <tr>
        <th>パスワード：</th>
      </tr>
      <tr>
        <td><input v-model="password" type="password" /></td>
      </tr>
    </table>

    <button @click="signUp">登録</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase';
import * as SessionManager from '../SessionManager';

@Component
export default class Signup extends Vue {
  private mailaddress = '';
  private password = '';

  mounted() {
    if (SessionManager.isLoggedIn()) {
      this.$router.push({ path: '/' });
      return;
    }
  }

  signUp() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.mailaddress, this.password)
      .then(user => {
        if (user && user.user) {
          user.user.getIdToken().then(idToken => {
            localStorage.setItem('jwt', idToken.toString());
            this.$router.push({ path: '/' });
          });
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }
}
</script>
