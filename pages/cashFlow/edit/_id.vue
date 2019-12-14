<template lang="pug">
section
  form-component(:record='record')
  .l-button.mb20(@click='update') 更新
  .l-button.danger(@click='remove') 削除

</template>

<script lang="ts">
import Vue from 'vue'
import formComponent from '../_form.vue'
import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'
export default Vue.extend({
  components: { formComponent },
  data() {
    const record = this.getRecord(this.$route.params.id)
    return {
      record,
      isPosting: false
    }
  },
  methods: {
    update() {
      this.isPosting = true
      const data = {
        name: this.record.name,
        amount: this.record.amount,
        isPayment: this.record.isPayment,
        date: this.record.date
      }
      const date = new Date(this.record.date)
      firestore
        .collection('cashRecords')
        .doc(this.record.id)
        .update(data)
        .then(() => {
          this.$router.push({
            path: '/cashFlow',
            query: {
              year: date.getFullYear(),
              month: date.getMonth() + 1
            }
          })
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
      /**
       */
    },
    remove() {
      const date = new Date(this.record.date)
      if (!confirm('レコードを削除します。よろしいですか？'))
        return Promise.resolve()
      return firestore
        .collection('cashRecords')
        .doc(this.record.id)
        .delete()
        .then(() => {
          this.$router.push({
            path: '/cashFlow',
            query: {
              year: date.getFullYear(),
              month: date.getMonth() + 1
            }
          })
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
    },
    getRecord(id: string): CashRecord {
      firestore
        .collection('cashRecords')
        .doc(id)
        .get()
        .then((doc) => {
          this.record = new CashRecord(doc.data(), id)
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
    }
  }
})
</script>
<style lang="scss" scoped>
.mb20 {
  margin-bottom: 20px;
}
</style>
