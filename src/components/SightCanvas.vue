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

  get playerVantage():Vantage {
    const store = useStore() as typeof gameStore;
    return store.state.playerVantage;
  }

  get level():Level {
    const store = useStore() as typeof gameStore;
    return store.state.level;
  }

  mounted():void {
    this.draw();
  }

  updated():void {
    this.draw();
  }

  draw(): void {
    const { playerVantage, level } = this;
    const canvas = this.$refs.canvas;
    level.drawAsSight(canvas, playerVantage);
  }
}
</script>

<style scoped lang="scss">
figure {
  background-color: turquoise;
  display: inline-block ;
}
</style>