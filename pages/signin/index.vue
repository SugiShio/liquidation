<template lang="pug">
div
  .l-button(
    @click='signinWithGoogle'
  ) Google アカウントでログイン
</template>

<script>
import firebase, { auth } from '~/plugins/firebase.js'
const provider = new firebase.auth.GoogleAuthProvider()

export default {
  layout: 'signin',
  created() {
    this.$store.commit('setLoaded')
    if (this.$store.state.isSignin) {
      this.$router.push('/')
    }
  },
  methods: {
    signinWithGoogle() {
      auth
        .signInWithPopup(provider)
        .then((response) => {
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
}
</script>
