<template lang="pug">
div
  a(@click='signout') {{ userName }}
  .wrapper
    nuxt
</template>

<style lang="scss">
@import '@/assets/reset.scss';
</style>

<script lang="ts">
import Vue from 'vue'
import { auth } from '~/plugins/firebase.js'
export default Vue.extend({
  computed: {
    userName() {
      return this.$store.state.userName || '名前未設定'
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', { user })
        if (this.$route.name === 'signin') {
          this.$router.push('/')
        }
      }
    })
  },
  methods: {
    signout() {
      auth.signOut().then(() => {
        this.$store.dispatch('signout')
        this.$router.push({ name: 'signin' })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
</style>
