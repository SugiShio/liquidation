<template lang="pug">
section
  month-selector(
    v-model='scope'
    @month-changed='updateScope')
  div.payment
    span.payment__amount {{ usersPayment }}
    span 円
  .verb {{ verb }}
  div 支出総額 {{ total }}円 / 支払い済み {{ usersTotal }}円
  router-link(to='cashFlow') 明細

</template>

<script lang="ts">
import Vue from 'vue'
import { addMonth } from '@/scripts/date'
import monthSelector from '@/components/monthSelector.vue'
export default Vue.extend({
  components: { monthSelector },
  computed: {
    total(): number {
      return this.$store.getters['cashFlow/total']
    },
    usersTotal(): number {
      return this.$store.getters['cashFlow/usersTotal']()
    },
    users() {
      return this.$store.getters['cashFlow/users']
    },
    usersPayment() {
      return Math.ceil(this.total / this.users.length - this.usersTotal)
    },
    verb() {
      return this.usersPayment < 0 ? 'もらう' : '支払う'
    }
  },
  data() {
    return {
      scope: addMonth(new Date(), -1)
    }
  },
  created() {
    this.setRecords()
  },
  methods: {
    updateScope(date: Date) {
      this.scope = date
      this.setRecords()
    },
    setRecords() {
      this.$store.commit('cashFlow/resetCashRecords')
      const year = this.scope.getFullYear()
      const month = this.scope.getMonth()
      const startDate = new Date(year, month)
      const endDate = new Date(year, month + 1)
      this.$store.dispatch('cashFlow/fetchScopedRecords', {
        startDate,
        endDate
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.payment {
  text-align: right;
  &__amount {
    font-size: 40px;
  }
}

.verb {
  text-align: right;
}
</style>
