<template lang="pug">
div
  header.header
    .header__item
      .header__backButton(
        v-show='hasHistory'
        @click='goBack')
        img(src='~/assets/images/left.svg')

    .header__item
      a(
        v-if='isSignin'
        @click='signout'
        ) Sign Out
  .wrapper
    nuxt
</template>

<script>
import { auth } from '~/plugins/firebase.js'
export default {
  computed: {
    isSignin() {
      return this.$store.state.isSignin
    },
    hasHistory() {
      return process.client ? history.length >= 1 : false
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (this.$route.name === 'signin') {
          this.$router.push('/')
        }
        this.$store.dispatch('setUp', { user })
      } else {
        this.$router.push('/signin')
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
}
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

  &__backButton img {
    width: 30px;
  }
}
</style>
