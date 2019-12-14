<template lang="pug">
li.item(@click='goEdit')
  .item__date {{ date }}日
  .item__content
    .item__name {{ record.name }}
    .item__amount
      span {{ amount }}
      |円
</template>

<script>
import CashRecord from '@/models/cashRecord.ts'
export default {
  props: {
    record: {
      type: Object,
      default: () => new CashRecord()
    }
  },
  computed: {
    amount() {
      return Number(this.record.amount).toLocaleString()
    },
    date() {
      const date = new Date(this.record.date)
      return date.getDate()
    }
  },
  methods: {
    goEdit() {
      this.$router.push({
        name: 'cashFlow-edit-id',
        params: { id: this.record.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables';
.item {
  padding: 10px 0;

  &__date {
    line-height: 1.2;
    font-size: 11px;
    color: rgba($color-text, 0.7);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  &__amount {
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
