<template>
  <figure :timeStamp="timeStamp.toString()">
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
    <p>
      {{ $store.state.game.data.playerCharacter.gridX }}, {{ $store.state.game.data.playerCharacter.gridY }}
      {{ $store.state.game.data.playerCharacter.data.direction.name }}
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
  declare $refs: { canvas: HTMLCanvasElement };

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
    const { playerCharacter, level } = this.$store.state.game.data;
    const canvas = this.$refs.canvas;
    level.drawAsMap(canvas, playerCharacter, 20 );
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