<template lang="pug">
section
  month-selector(
    v-model='scope'
    @month-changed='updateScope')
  .total
    |合計
    span {{ Number(total).toLocaleString() }}
    |円
  ul.list
    list-item(
      v-for='record in records'
      :record='record')
  .addButton(
    @click='$router.push("/cashFlow/new")'
    size='small'
    ) +
</template>

<script lang="ts">
import Vue from 'vue'
import listItem from './_listItem.vue'
import firebase from '~/plugins/firebase.js'
import { addMonth } from '@/scripts/date'
import CashRecord from '@/models/cashRecord.ts'
import monthSelector from '@/components/monthSelector.vue'

export default Vue.extend({
  components: { monthSelector, listItem },
  asyncData({ route }) {
    const year = Number(route.query.year)
    const month = Number(route.query.month)
    const scope =
      year && month ? new Date(year, month - 1) : addMonth(new Date(), -1)
    return {
      scope
    }
  },
  computed: {
    records() {
      return this.$store.state.cashFlow.cashRecords
    },
    total() {
      return this.$store.getters['cashFlow/total']
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
    },
    date(timestamp: number) {
      const date = new Date(timestamp)
      return date.getDate()
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/variables';
.total {
  margin: 40px 0 20px;
  text-align: right;
  span {
    margin: 0 3px 0 10px;
    font-size: 30px;
  }
}

.list {
  margin: 20px auto;
}

.addButton {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  border-radius: 20px;
  background-color: $color-text;
  box-shadow: 0 2px 5px rgba(#000, 0.5);
  font-size: 30px;
  text-align: center;
  line-height: 40px;
  color: $color-main;
}
</style>
