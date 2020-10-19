<template>
  <div class="signin">
    <table>
      <tr>
        <th>メールアドレス：</th>
      </tr>
      <tr>
        <td><input v-model="mailaddress2" type="email" /></td>
      </tr>
      <tr>
        <th>パスワード：</th>
      </tr>
      <tr>
        <td><input v-model="password2" type="password" /></td>
      </tr>
    </table>

    <button @click="signIn">ログイン</button>
    <p>
      新しいアカウントを作成しますか？
      <router-link to="/signup">新規登録</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase';
import * as SessionManager from '../SessionManager';

@Component
export default class Login extends Vue {
  private mailaddress2 = '';
  private password2 = '';

  mounted() {
    if (SessionManager.isLoggedIn()) {
      this.$router.push({ path: '/' });
      return;
    }
  }

  signIn() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.mailaddress2, this.password2)
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
