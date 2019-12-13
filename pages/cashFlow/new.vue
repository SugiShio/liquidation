<template lang="pug">
section
  el-form(label-width='25%')
    el-form-item(
      label='名称'
      )
      el-input(
        v-model='record.name'
        )
    el-form-item(
      label='金額'
      )
      el-input-number(
        v-model='record.amount'
        :controls='false'
        :min='0'
        )
    el-form-item(
      label='日付'
      )
      el-date-picker(
        type='date'
        v-model='record.date'
        format='yyyy/MM/dd'
        value-format='timestamp'
        )
    el-form-item
      el-radio-group(v-model='record.isPayment')
        el-radio-button(:label='true') 支払った
        el-radio-button(:label='false') 受け取った
    .l-button(@click='create') 送信

</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'

export default Vue.extend({
  data() {
    return {
      record: new CashRecord(),
      isPosting: false
    }
  },
  methods: {
    create() {
      const whose = this.$store.state.userName
      this.isPosting = true
      const data = {
        name: this.record.name,
        amount: this.record.amount,
        isPayment: this.record.isPayment,
        createdAt: new Date(),
        date: this.record.date,
        whose
      }
      return firebase
        .firestore()
        .collection('cashRecords')
        .doc()
        .set(data)
        .then(() => {
          this.$router.push('/cashFlow')
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
    }
  }
})
</script>
