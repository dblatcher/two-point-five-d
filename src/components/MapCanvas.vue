<template>
  <figure :timeStamp="timeStamp.toString()">
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
    <p>
      {{ $store.state.playerVantage.data.x }}, {{ $store.state.playerVantage.data.y }}
      {{ $store.state.playerVantage.data.direction.name }}
    </p>
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
export default class MapCanvas extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  $refs!: { canvas: HTMLCanvasElement };

  // maintains reactivity - change to the store value triggers updated() 
  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  mounted() {
    this.draw();
  }

  updated() {
    this.draw();
  }

  draw(): void {
    const { playerVantage, level } = this.$store.state;
    const canvas = this.$refs.canvas;
    level.drawAsMap(canvas, playerVantage, 20 );
  }
}
</script>

<style scoped lang="scss">
figure {
  display: inline-block;
  background-color: burlywood;
}

p {
  margin: 0;
}
</style>