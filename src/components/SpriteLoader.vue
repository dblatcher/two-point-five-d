<template>
  <div data-role="sprite-loader">
    <section
      v-for="sprite in $store.state.spriteData"
      v-bind:key="sprite.name"
      :data-name="sprite.name"
    >
      <img
        v-for="image in sprite.frames"
        :key="image.key"
        :src="image.src"
        :frame="image.key"
        :sheet="sprite.name"
      />
    </section>
  </div>
</template>

<script lang='ts'>
import { Vue } from "vue-class-component";
import gameStore from "@/store";

export default class SpriteLoader extends Vue {
  $store!: typeof gameStore;
}
</script>

<style scoped>
div {
  display: none;
}
</style>