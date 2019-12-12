<template lang="pug">
section.wrapper
  month-selector(
    v-model='scope'
    @month-changed='updateScope')

  ul.list
    li.item(v-for='record in records')
      div {{ date(record.date) }} 日
      div {{ record.name }}
      div {{ record.amount }}
    li.item
      div
      div 合計
      div {{ total }}
  el-button(
    @click='$router.push("/cashFlow/new")'
    size='small'
    ) 新規追加
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '~/plugins/firebase.js'
import { addMonth } from '@/scripts/date'
import CashRecord from '@/models/cashRecord.ts'
import monthSelector from '@/components/monthSelector.vue'

export default Vue.extend({
  components: { monthSelector },
  data() {
    return {
      scope: addMonth(new Date(), -1)
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
.wrapper {
  min-height: 100vh;
  position: relative;
  padding: 30px 10px;
}
.list {
  margin: 50px auto;
}
.item {
  display: flex;
  padding: 5px 0;

  > div {
    flex-basis: 100%;
  }

  &:last-child {
    border-top: 1px solid #bbb;
  }
}
</style>
