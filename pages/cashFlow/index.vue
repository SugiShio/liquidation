<template lang="pug">
section.wrapper
  ul.list
    li.item(v-for='record in records')
      div {{ record.name }}
      div {{ record.amount }}
    li.item
      div 合計
      div {{ total }}
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'

export default Vue.extend({
  data() {
    const records: CashRecord[] = []
    return {
      records,
      total: 0
    }
  },
  created() {
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
    const collection = firebase.firestore().collection('cashRecords')
    collection
      .orderBy('date')
      .where('date', '>=', startDate.valueOf())
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          const record = new CashRecord(doc.data())
          this.records.push(record)
          this.total += record.amount
        })
      })
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
  max-width: 600px;
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
