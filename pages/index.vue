<template lang="pug">
section
  section.scope
    .scope__prev
      span(@click='prevMonth') <
    h2.scope__scoped
      span.scope__year {{ year }}年
      span.scope__month
        span.scope__monthAmount {{ month+1 }}
        | 月
    .scope__next
      span(@click='nextMonth') >
  div.payment
    span.payment__amount {{ usersPayment }}
    span 円
  .verb {{ verb }}
  div 支出総額 {{ total }}円 / 支払い済み {{ usersTotal }}円
  router-link(to='cashFlow') 明細

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth() - 1
    }
  },
  created() {
    this.setRecords()
  },
  methods: {
    prevMonth() {
      --this.month
      if (this.month < 0) {
        this.month += 12
        --this.year
      }
      this.setRecords()
    },
    nextMonth() {
      ++this.month
      if (this.month > 11) {
        this.month = this.month % 12
        ++this.year
      }
      this.setRecords()
    },
    setRecords() {
      this.$store.commit('cashFlow/resetCashRecords')
      const startDate = new Date(this.year, this.month)
      const endDate = new Date(this.year, this.month + 1)
      this.$store.dispatch('cashFlow/fetchScopedRecords', {
        startDate,
        endDate
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.scope {
  display: flex;
  justify-content: center;
  align-items: center;

  &__scoped {
    text-align: center;
  }

  &__year,
  &__month {
    display: block;
    line-height: 1.2;
  }

  &__month {
    font-size: 20px;
  }

  &__monthAmount {
    margin-right: 2px;
    font-size: 30px;
    line-height: inherit;
  }

  &__prev,
  &__next {
    display: block;
    margin: 0 30px;
    border-radius: 15px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;

    &:hover {
      background-color: pink;
    }
  }
}

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
