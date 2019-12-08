<template lang="pug">
section.wrapper
  h2 {{ scopeText }}
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
import CashRecord from '@/models/cashRecord.ts'

export default Vue.extend({
  data() {
    const records: CashRecord[] = []
    const today = new Date()
    const scope = new Date(today.getFullYear(), today.getMonth())
    return {
      records,
      total: 0,
      scope
    }
  },
  computed: {
    scopeText(): string {
      const scope = new Date(this.scope)
      return `${scope.getFullYear()}年${scope.getMonth() + 1}月`
    }
  },
  created() {
    const collection = firebase.firestore().collection('cashRecords')
    const endDate = new Date(
      this.scope.getFullYear(),
      this.scope.getMonth() + 1
    ).valueOf()
    collection
      .orderBy('date')
      .where('date', '>=', this.scope.valueOf())
      .where('date', '<', endDate)
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          const record = new CashRecord(doc.data())
          this.records.push(record)
          this.total += record.amount
        })
      })
  },
  methods: {
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
