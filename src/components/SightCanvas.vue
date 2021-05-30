<template>
  <figure>
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
    <p>
      {{ vantage.data.x }}, {{ vantage.data.y }}
      {{ vantage.data.direction.name }}
    </p>
  </figure>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";

import gameStore from "@/store";
import { Vantage } from "@/game-classes/Vantage";
import { Level } from "@/game-classes/Level";

@Options({
  props: {
    caption: String,
  },
})
export default class SightCanvas extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  $refs!: { canvas: HTMLCanvasElement };

  get vantage():Vantage {
    const store = useStore() as typeof gameStore;
    return store.state.vantage;
  }

  get floor():Level {
    const store = useStore() as typeof gameStore;
    return store.state.floor;
  }

  mounted():void {
    this.draw();
  }

  updated():void {
    this.draw();
  }

  draw(): void {
    const { vantage, floor } = this;
    const canvas = this.$refs.canvas;
    floor.drawAsSight(canvas, vantage);
  }
}
</script>

<style scoped lang="scss">
figure {
  background-color: turquoise;
  display: inline-block ;
}
</style>