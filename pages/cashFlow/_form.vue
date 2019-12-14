<template lang="pug">
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

</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'

export default Vue.extend({
  props: {
    record: {
      type: Object,
      default: () => new CashRecord()
    }
  }
})
</script>
