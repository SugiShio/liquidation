<template lang="pug">
section.scope
  .scope__prev
    span(@click='prevMonth')
      img(src='~/assets/images/left.svg')

  h2.scope__scoped(@click='backToTop')
    span.scope__year {{ year }}年
    span.scope__month
      span.scope__monthAmount {{ month+1 }}
      | 月
  .scope__next
    span(@click='nextMonth')
      img(src='~/assets/images/right.svg')
</template>

<script>
import { addMonth } from '@/scripts/date'
export default {
  props: {
    value: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  computed: {
    year() {
      return this.value.getFullYear()
    },
    month() {
      return this.value.getMonth()
    }
  },
  methods: {
    prevMonth() {
      this.$emit('month-changed', addMonth(this.value, -1))
    },
    nextMonth() {
      this.$emit('month-changed', addMonth(this.value, 1))
    },
    backToTop() {
      this.$router.push({
        path: '/',
        query: {
          year: this.value.getFullYear(),
          month: this.value.getMonth() + 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scope {
  display: flex;
  justify-content: center;
  align-items: center;

  &__scoped {
    text-align: center;
  }

  &__year,
  &__month {
    display: block;
    line-height: 1.2;
  }

  &__month {
    font-size: 20px;
  }

  &__monthAmount {
    margin-right: 2px;
    font-size: 30px;
    line-height: inherit;
  }

  &__prev,
  &__next {
    display: block;
    margin: 0 30px;
    border-radius: 15px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}
</style>
