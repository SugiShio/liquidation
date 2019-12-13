<template lang="pug">
section
  month-selector(
    v-model='scope'
    @month-changed='updateScope')
  .payment
    span.payment__amount {{ Number(Math.abs(usersPayment)).toLocaleString() }}
    span 円 {{ verb }}
  .totalBox
    .totalBox__item
      .totalBox__label 支出総額
      .totalBox__amount
        span {{ Number(total).toLocaleString() }}
        | 円
    .totalBox__item
      .totalBox__label 支払い済み
      .totalBox__amount
        span {{ Number(usersTotal).toLocaleString() }}
        | 円
  router-link.l-button(
    :to='detailLink'
    ) 明細

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
    },
    detailLink() {
      return {
        name: 'cashFlow',
        query: {
          year: this.scope.getFullYear(),
          month: this.scope.getMonth() + 1
        }
      }
    }
  },
  asyncData({ route }) {
    const year = Number(route.query.year)
    const month = Number(route.query.month)
    const scope =
      year && month ? new Date(year, month - 1) : addMonth(new Date(), -1)
    return {
      scope
    }
  },
  created() {
    this.setRecords()
  },
  methods: {
    updateScope(date: Date) {
      this.scope = date
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
  },
  watch: {
    scope() {
      this.$router.push({
        query: {
          year: this.scope.getFullYear(),
          month: this.scope.getMonth() + 1
        }
      })
      this.setRecords()
    },
    '$route.query'() {
      const year = Number(this.$route.query.year)
      const month = Number(this.$route.query.month)
      this.scope =
        year && month ? new Date(year, month - 1) : addMonth(new Date(), -1)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/variables';
.payment {
  margin: 40px 0;
  text-align: center;
  &__amount {
    font-size: 40px;
  }
}

.totalBox {
  margin: 30px 0;
  display: flex;
  justify-content: center;

  &__item {
    text-align: center;
    margin: 0 20px;
  }

  &__label {
    font-size: 11px;
    color: rgba($color-text, 0.7);
  }

  &__amount {
    span {
      margin-right: 2px;
      font-weight: bold;
      font-size: 20px;
    }
  }
}
</style>
