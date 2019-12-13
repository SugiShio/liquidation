<template lang="pug">
div
  header.header
    .header__item
      div(
        v-if='hasHistory'
        @click='goBack') <
    .header__item
      a(@click='signout') Sign Out
  .wrapper
    nuxt
</template>

<script lang="ts">
import Vue from 'vue'
import { auth } from '~/plugins/firebase.js'
export default Vue.extend({
  computed: {
    hasHistory() {
      return process.client ? history.length >= 1 : false
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
    },
    goBack() {
      if (process.client) history.back()
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 600px;
  margin: auto;
  padding: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}
</style>
