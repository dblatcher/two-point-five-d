<template>
  <figure>
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
    <p>
      {{ playerVantage.data.x }}, {{ playerVantage.data.y }}
      {{ playerVantage.data.direction.name }}
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

  get playerVantage() {
    const store = useStore() as typeof gameStore;
    return store.state.playerVantage;
  }

  get level() {
    const store = useStore() as typeof gameStore;
    return store.state.level;
  }

  mounted() {
    this.draw();
  }

  updated() {
    this.draw();
  }

  draw(): void {
    const { playerVantage, level } = this;
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