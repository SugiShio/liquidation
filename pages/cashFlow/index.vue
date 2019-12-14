<template lang="pug">
section
  month-selector(
    v-model='scope'
    @month-changed='updateScope')
  .total
    |合計
    span {{ numToString(total) }}
    |円
  .text(v-if='isLoading') 読み込み中
  ul.list(v-else-if='records.length')
    list-item(
      v-for='record in records'
      :record='record'
      :key='record.id')
  .text(v-else) 入出金がありません
  .addButton(
    @click='$router.push("/cashFlow/new")'
    size='small'
    )
      img(src='~/assets/images/plus.svg')
</template>

<script>
import listItem from './_listItem.vue'
import firebase from '~/plugins/firebase.js'
import { addMonth } from '@/scripts/date'
import CashRecord from '@/models/cashRecord.ts'
import monthSelector from '@/components/monthSelector.vue'

export default {
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
  data() {
    return {
      isLoading: true
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
    updateScope(date) {
      this.scope = date
      this.setRecords()
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
  }
}
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
  padding: 5px;
  border-radius: 20px;
  background-color: $color-text;
  box-shadow: 0 2px 5px rgba(#000, 0.5);

  img {
    width: 30px;
    height: 30px;
  }
}

.text {
  margin: 10px 0;
  text-align: center;
  color: rgba($color-text, 0.6);
}
</style>
