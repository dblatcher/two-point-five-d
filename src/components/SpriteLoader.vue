<template>
  <div data-role="sprite-loader">
    <img
      v-for="spriteSheet in $store.state.spriteSheets"
      :key="spriteSheet.id"
      :sheet-id="spriteSheet.id"
      :src="spriteSheet.src"
    />
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