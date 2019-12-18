<template lang="pug">
section
  form-component(:record='record')
  .l-button(
    :class='{disable: isPosting}'
    @click='create') 送信

</template>

<script>
import { mapState } from 'vuex'
import formComponent from './_form.vue'
import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'

export default {
  components: { formComponent },
  data() {
    return {
      record: new CashRecord(),
      isPosting: false
    }
  },
  computed: {
    ...mapState(['currentRoomId'])
  },
  methods: {
    create() {
      if (this.isPosting) return
      this.isPosting = true
      const whose = this.$store.state.uid
      const data = {
        name: this.record.name,
        amount: this.record.amount,
        isPayment: this.record.isPayment,
        createdAt: new Date(),
        date: this.record.date,
        whose
      }
      const date = new Date(this.record.date)
      firestore
        .collection('rooms')
        .doc(this.currentRoomId)
        .collection('cashRecords')
        .doc()
        .set(data)
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
    }
  }
}
</script>
