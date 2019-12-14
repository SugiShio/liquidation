<template lang="pug">
div
  .l-button(
    @click='signinWithGoogle'
  ) Google アカウントでログイン
  div
</template>

<script lang="ts">
import Vue from 'vue'
import firebase, { auth } from '~/plugins/firebase.js'
const provider = new firebase.auth.GoogleAuthProvider()

export default Vue.extend({
  created() {
    if (this.$store.state.isSignin) {
      this.$router.push('/')
    }
  },
  methods: {
    signinWithGoogle() {
      auth
        .signInWithPopup(provider)
        .then((response) => {
          console.log('addfs ', response.user)
          this.$store.dispatch('updateUser', {
            user: response.user
          })
          this.$router.push('/')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
})
</script>
