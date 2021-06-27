<template>
  <figure :timeStamp="timeStamp.toString()">
    <figcaption>{{ caption }}</figcaption>
    <figcaption>holding: {{ itemName }}</figcaption>
    <canvas ref="canvas" @click="handleCanvasClick"></canvas>
  </figure>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";

import gameStore from "@/store";

interface SightCanvasData {
  itemName: string;
}

@Options({
  props: {
    caption: String,
  },
})
export default class SightCanvas extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  declare $data: SightCanvasData;
  declare $refs: { canvas: HTMLCanvasElement };

  data(): SightCanvasData {
    return {
      itemName: "",
    };
  }

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
    const { playerVantage, level,itemInHand } = this.$store.state.game.data;
    const canvas = this.$refs.canvas;
    level.drawAsSight(canvas, playerVantage);

    this.$data.itemName = itemInHand ? itemInHand.data.type.description : "";
  }

  handleCanvasClick(event: PointerEvent): void {
    const { canvas } = this.$refs;
    const rect = canvas.getBoundingClientRect();

    this.$store.dispatch("sightClick", {
      x: event.offsetX / rect.width,
      y: event.offsetY / rect.height,
    });
  }
}
</script>

<style scoped lang="scss">
figure {
  background-color: turquoise;
  display: inline-block;
}
</style>