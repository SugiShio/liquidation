<template lang="pug">
.loading(v-if='isLoading')
  .loading__bar
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['isLoading'])
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  &__bar {
    width: 100%;
    max-width: 500px;
    height: 4px;
    background-color: rgba(#fff, 0.1);
    overflow: hidden;

    &::before {
      content: '';
      display: block;
      width: 30%;
      height: 4px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(#fff, 0.3),
        transparent
      );
      animation: 2s infinite slide;
    }
  }
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(1000px);
  }
}
</style>
