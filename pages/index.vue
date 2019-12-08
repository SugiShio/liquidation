<template lang="pug">
div {{ getTotal }}

</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters('cashFlow', ['getTotal'])
  },
  created() {
    this.$store.dispatch('cashFlow/fetchScopedRecords')
  }
})
</script>

<style></style>
