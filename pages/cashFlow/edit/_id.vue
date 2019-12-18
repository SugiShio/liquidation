<template lang="pug">
section
  form-component(:record='record')
  .l-button.mb20(@click='update') 更新
  .l-button.danger(@click='remove') 削除

</template>

<script>
import { mapState } from 'vuex'
import formComponent from '../_form.vue'
import { firestore } from '~/plugins/firebase.js'
import CashRecord from '@/models/cashRecord.ts'
let roomRef
export default {
  components: { formComponent },
  data() {
    return {
      record: {},
      isPosting: false
    }
  },
  computed: {
    ...mapState(['currentRoomId'])
  },
  created() {
    if (this.currentRoomId) this.setRecord()
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
      roomRef
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
    },
    remove() {
      const date = new Date(this.record.date)
      if (!confirm('レコードを削除します。よろしいですか？'))
        return Promise.resolve()
      return roomRef
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
    setRecord() {
      const id = this.$route.params.id
      roomRef = firestore
        .collection('rooms')
        .doc(this.currentRoomId)
        .collection('cashRecords')
        .doc(id)
      roomRef
        .get()
        .then((doc) => {
          this.record = new CashRecord(doc.data(), id)
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
    }
  },
  watch: {
    currentRoomId(id) {
      if (!id) return
      this.setRecord()
    }
  }
}
</script>
<style lang="scss" scoped>
.mb20 {
  margin-bottom: 20px;
}
</style>
