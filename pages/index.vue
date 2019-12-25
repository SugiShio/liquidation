<template lang="pug">
section
  h2.roomName {{ room.name }}
  month-selector(
    v-model='scope'
    @month-changed='updateScope')
  .payment
    span.payment__amount {{ numToString(usersPayment) }}
    span 円 {{ verb }}
  .totalBox
    .totalBox__item
      .totalBox__label 支出総額
      .totalBox__amount
        span {{ numToString(total) }}
        | 円
    .totalBox__item
      .totalBox__label 支払い済み
      .totalBox__amount
        span {{ numToString(usersTotal_) }}
        | 円
  router-link.l-button(
    :to='detailLink'
    ) 明細

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { addMonth } from '@/scripts/date'
import monthSelector from '@/components/monthSelector.vue'
export default {
  components: { monthSelector },
  computed: {
    ...mapState(['currentRoomId', 'room']),
    ...mapGetters('cashFlow', ['total', 'usersTotal']),
    usersTotal_() {
      return this.usersTotal()
    },
    usersPayment() {
      const users = this.room.users || []
      if (!users.length) return 0
      return Math.ceil(this.total / users.length - this.usersTotal_)
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
  data() {
    const year = Number(this.$route.query.year)
    const month = Number(this.$route.query.month)
    const scope =
      year && month ? new Date(year, month - 1) : addMonth(new Date(), -1)
    return {
      scope,
      isLoading: true
    }
  },
  created() {
    if (this.currentRoomId) this.setRecords()
  },
  methods: {
    updateScope(date) {
      this.scope = date
    },
    setRecords() {
      this.isLoading = true
      const year = this.scope.getFullYear()
      const month = this.scope.getMonth()
      const startDate = new Date(year, month)
      const endDate = new Date(year, month + 1)
      this.$store
        .dispatch('cashFlow/fetchScopedRecords', {
          startDate,
          endDate
        })
        .then(() => {
          this.isLoading = false
        })
    },
    numToString(num) {
      return this.isLoading ? '---' : Number(Math.abs(num)).toLocaleString()
    }
  },
  watch: {
    currentRoomId(val) {
      if (!val) return
      this.setRecords()
    },

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
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables';
.roomName {
  text-align: center;
  color: rgba($color-text, 0.7);
}

.scope {
  margin: 20px 0;
}

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
