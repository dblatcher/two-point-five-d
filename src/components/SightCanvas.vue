<template>
  <figure :timeStamp="timeStamp.toString()">
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
  </figure>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";

import gameStore from "@/store";

@Options({
  props: {
    caption: String,
  },
})
export default class SightCanvas extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  declare $refs: { canvas: HTMLCanvasElement };

  // maintains reactivity - change to the store value triggers updated() 
  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  mounted(): void {
    this.draw();
  }

  updated(): void {
    this.draw();
  }

  draw(): void {
    const { playerVantage, level } = this.$store.state.game.data;
    const canvas = this.$refs.canvas;
    level.drawAsSight(canvas, playerVantage);
  }
}
</script>

<style scoped lang="scss">
figure {
  background-color: turquoise;
  display: inline-block;
}
</style>